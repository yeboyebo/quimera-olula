import { ejecutarListaProcesos, MetaModelo, publicar } from "@olula/lib/dominio.ts";

import { cambioClienteVentaVacio, metaCambioClienteVenta, metaVenta } from "#/ventas/venta/dominio.ts";
import { ProcesarContexto } from "@olula/lib/diseño.js";
import { CambioClienteFactura, ContextoVentaTpv, EstadoVentaTpv, LineaFactura, PagoVentaTpv, VentaTpv } from "../diseño.ts";
import { ventaTpvVacia } from "../dominio.ts";
import { getLineas, getPagos, getVenta, patchFactura, postEmitirVale, postLineaPorBarcode } from "../infraestructura.ts";


export const cambioClienteFacturaVacio: CambioClienteFactura = cambioClienteVentaVacio;

export const metaCambioClienteFactura: MetaModelo<CambioClienteFactura> = metaCambioClienteVenta;

const onChangeVentaTpv = (venta: VentaTpv, campo: string, _: unknown, otros?: Record<string, unknown>) => {
    if (campo === "divisa_id" && otros) {
        return {
            ...venta,
            tasa_conversion: otros.tasa_conversion as number
        }
    }
    return venta;
}

export const metaVentaTpv: MetaModelo<VentaTpv> = {
    campos: {
        fecha: { tipo: "fecha", requerido: false },
        ...metaVenta.campos,
    },
    onChange: onChangeVentaTpv
};


type ProcesarVentaTpv = ProcesarContexto<EstadoVentaTpv, ContextoVentaTpv>;

const pipeVentaTpv = ejecutarListaProcesos<EstadoVentaTpv, ContextoVentaTpv>;

const cargarVenta: (_: string) => ProcesarVentaTpv = (idVenta) =>
    async (contexto) => {

        const venta = await getVenta(idVenta);
        return {
            ...contexto,
            venta,
        }
    }

export const refrescarVenta: ProcesarVentaTpv = async (contexto) => {

    const venta = await getVenta(contexto.venta.id);
    return [
        {
            ...contexto,
            venta: {
                ...contexto.venta,
                ...venta
            },
        },
        [["venta_cambiada", venta]]
    ]
}

export const cancelarcambioVenta: ProcesarVentaTpv = async (contexto) => {

    return {
        ...contexto,
        venta: contexto.ventaInicial
    }
}

export const abiertaOEmitidaContexto: ProcesarVentaTpv = async (contexto) => {
    return {
        ...contexto,
        estado: contexto.venta.abierta ? "ABIERTA" : "EMITIDA"
    }
}

export const refrescarPagos: ProcesarVentaTpv = async (contexto) => {

    const pagos = await getPagos(contexto.venta.id);
    return {
        ...contexto,
        venta: {
            ...contexto.venta,
            pagos,
        },
    }
}

export const refrescarLineas: ProcesarVentaTpv = async (contexto) => {

    const lineas = await getLineas(contexto.venta.id);
    return {
        ...contexto,
        venta: {
            ...contexto.venta,
            lineas
        }
    }
}

export const activarPago: ProcesarVentaTpv = async (contexto, payload) => {

    const pagoActivo = payload as PagoVentaTpv;
    return {
        ...contexto,
        pagoActivo
    }
}

const activarPagoPorIndice: (_: number) => ProcesarVentaTpv = (indice) => async (contexto) => {

    const pagos = contexto.venta.pagos;
    const pagoActivo = pagos.length > 0
        ? indice >= 0 && indice < pagos.length
            ? pagos[indice]
            : pagos[pagos.length - 1]
        : null

    return {
        ...contexto,
        pagoActivo
    }
}


// export const pagarConVale: ProcesarVentaTpv = async (contexto, payload) => {

//     const pagoConVale = payload as NuevoPagoVale;
//     return await pagar(contexto, pagoConVale.importe, "VALE", pagoConVale.vale_id);
// }

// export const pagarEnEfectivo: ProcesarVentaTpv = async (contexto, payload) => {

//     const pagoEnEfectivo = payload as NuevoPagoEfectivo;
//     return await pagar(contexto, pagoEnEfectivo.importe, "EFECTIVO");
// }

// export const pagarConTarjeta: ProcesarVentaTpv = async (contexto, payload) => {

//     const pagoConTarjeta = payload as NuevoPagoEfectivo;
//     return await pagar(contexto, pagoConTarjeta.importe, "TARJETA");
// }

// const pagar = async (
//     contexto: ContextoVentaTpv,
//     importe: number,
//     formaPago: string,
//     idVale?: string
// ): Promise<ResultadoProcesoContexto<EstadoVentaTpv, ContextoVentaTpv>> => {

//     await postPago(
//         contexto.venta.id,
//         {
//             importe,
//             formaPago,
//             idVale
//         }
//     );

//     return pipeVentaTpv(contexto, [
//         refrescarVenta,
//         refrescarPagos,
//         abiertaOEmitidaContexto,
//     ]);
// }

export const onPagoBorrado: ProcesarVentaTpv = async (contexto, payload) => {

    const idPago = payload as string;
    // await deletePago(contexto.venta.id, idPago);

    const indicePagoActivo = contexto.venta.pagos.findIndex(l => l.id === idPago);

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarPagos,
        activarPagoPorIndice(indicePagoActivo),
        'ABIERTA',
    ]);
}

export const cambiarVenta: ProcesarVentaTpv = async (contexto, payload) => {

    const venta = payload as VentaTpv;
    await patchFactura(contexto.venta.id, venta)

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        'ABIERTA',
    ]);
}

export const onVentaBorrada: ProcesarVentaTpv = async (contexto) => {

    const venta = contexto.venta;
    // await borrarFactura(venta.id);

    return pipeVentaTpv(contexto, [
        getContextoVacio,
        publicar('venta_borrada', venta)
    ]);
}

export const onLineaCreada: ProcesarVentaTpv = async (contexto, payload) => {

    // const nuevaLinea = payload as NuevaLineaFactura;
    // const idLinea = await postLinea(contexto.venta.id, nuevaLinea);
    const idLinea = payload as string;

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        activarLineaPorId(idLinea),
    ]);
}

export const crearLineaPorBarcode: ProcesarVentaTpv = async (contexto, payload) => {

    const barcode = payload as string;
    const idLinea = await postLineaPorBarcode(contexto.venta.id, {
        barcode,
        cantidad: 1
    });

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        activarLineaPorId(idLinea),
        'ABIERTA',
    ]);
}

export const onLineaCambiada: ProcesarVentaTpv = async (contexto, payload) => {

    const linea = payload as LineaFactura;
    // await patchLinea(contexto.venta.id, linea)

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        activarLineaPorId(linea.id),
        'ABIERTA',
    ]);
}


export const onLineaBorrada: ProcesarVentaTpv = async (contexto, payload) => {

    const idLinea = payload as string;

    const indiceLineaActiva = contexto.venta.lineas.findIndex(l => l.id === idLinea);

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        activarLineaPorIndice(indiceLineaActiva),
        'ABIERTA',
    ]);
}

export const emitirVale: ProcesarVentaTpv = async (contexto, payload) => {

    const venta = payload as VentaTpv
    await postEmitirVale(venta)

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarPagos,
        abiertaOEmitidaContexto,
    ]);
}


export const activarLinea: ProcesarVentaTpv = async (contexto, payload) => {

    const lineaActiva = payload as LineaFactura;
    return {
        ...contexto,
        lineaActiva
    }
}

const activarLineaPorIndice = (indice: number) => async (contexto: ContextoVentaTpv) => {

    const lineas = contexto.venta.lineas;
    const lineaActiva = lineas.length > 0
        ? indice >= 0 && indice < lineas.length
            ? lineas[indice]
            : lineas[lineas.length - 1]
        : null

    return {
        ...contexto,
        lineaActiva
    }
}

const activarLineaPorId = (id: string) => async (contexto: ContextoVentaTpv) => {

    const lineas = contexto.venta.lineas;
    const lineaActiva = lineas.find(l => l.id === id) ?? null;

    return {
        ...contexto,
        lineaActiva
    }
}

export const getContextoVacio: ProcesarVentaTpv = async (contexto) => {

    return {
        ...contexto,
        estado: 'INICIAL',
        venta: ventaTpvVacia,
        pagoActivo: null,
        lineaActiva: null
    }
}

export const cargarContexto: ProcesarVentaTpv = async (contexto, payload) => {

    const idVenta = payload as string;
    if (idVenta) {
        return pipeVentaTpv(
            contexto,
            [
                cargarVenta(idVenta),
                refrescarPagos,
                refrescarLineas,
                abiertaOEmitidaContexto,
                activarLineaPorIndice(0),
                activarPagoPorIndice(0),
            ],
            payload
        );
    } else {
        return getContextoVacio(contexto);
    }
}


