import { Factura } from "#/ventas/factura/diseño.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { ejecutarListaProcesos, MetaModelo, publicar } from "@olula/lib/dominio.ts";

import { nuevaLineaVentaVacia } from "#/ventas/presupuesto/dominio.ts";
import { cambioClienteVentaVacio, metaCambioClienteVenta, metaLineaVenta, metaNuevaLineaVenta, metaVenta, ventaVacia } from "#/ventas/venta/dominio.ts";
import { Criteria, ProcesarContexto, ResultadoProcesoContexto } from "@olula/lib/diseño.js";
import {
    CambioClienteFactura,
    ContextoMaestroVentasTpv,
    ContextoVentaTpv,
    EstadoMaestroVentasTpv,
    EstadoVentaTpv,
    LineaFactura,
    NuevaLineaFactura,
    NuevoPagoEfectivo,
    NuevoPagoVale,
    PagoVentaTpv,
    VentaTpv,
    VentaTpvADevolver
} from "./diseño.ts";
import { borrarFactura, deleteLinea, deletePago, getLineas, getPagos, getVenta, getVentas, patchDevolverVenta, patchFactura, patchLinea, postEmitirVale, postLinea, postLineaPorBarcode, postPago, postVenta } from "./infraestructura.ts";

export const ventaTpvVacia: VentaTpv = {
    ...ventaVacia,
    pagado: 0,
    pendiente: 0,
    lineas: [],
    pagos: []
};

export const nuevoPagoEfectivoVacio: NuevoPagoEfectivo = {
    importe: 0
}

export const nuevoPagoValeVacio: NuevoPagoVale = {
    importe: 0,
    saldoVale: 0,
    aPagar: 0,
    vale_id: ""
}

const validacionNuevoPagoVale = (pago: NuevoPagoVale) => {
    if (pago.importe < 0) {
        return "El importe no puede ser negativo";
    }
    if (pago.importe > pago.saldoVale) {
        return "El importe no puede ser mayor que el saldo del vale";
    }
    if (pago.importe > pago.aPagar) {
        return "El importe no puede ser mayor que el importe a pagar";
    }
    return true;
}

export const metaNuevoPagoVale: MetaModelo<NuevoPagoVale> = {
    campos: {
        importe: { tipo: "numero", requerido: true, validacion: validacionNuevoPagoVale },
        saldoVale: { tipo: "numero", requerido: true },
        vale_id: { tipo: "texto", requerido: true },
    }
};


export const cambioClienteFacturaVacio: CambioClienteFactura = cambioClienteVentaVacio;

export const nuevaLineaFacturaVacia: NuevaLineaFactura = nuevaLineaVentaVacia;

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


export const metaLineaFactura: MetaModelo<LineaFactura> = metaLineaVenta;

export const metaNuevaLineaFactura: MetaModelo<NuevaLineaFactura> = metaNuevaLineaVenta;

// export const metaNuevoPagoEfectivo: MetaModelo<NuevoPagoEfectivo> = metaNuevoPagoEfecctivo;


export const metaTablaFactura: MetaTabla<Factura> = [
    {
        id: "codigo",
        cabecera: "Código",
    },
    {
        id: "fecha",
        cabecera: "Fecha",
    },
    {
        id: "nombre_cliente",
        cabecera: "Cliente",
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
    },
];

type ProcesarVentaTpv = ProcesarContexto<EstadoVentaTpv, ContextoVentaTpv>;
type ProcesarVentasTpv = ProcesarContexto<EstadoMaestroVentasTpv, ContextoMaestroVentasTpv>;

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


export const pagarConVale: ProcesarVentaTpv = async (contexto, payload) => {

    const pagoConVale = payload as NuevoPagoVale;
    return await pagar(contexto, pagoConVale.importe, "VALE", pagoConVale.vale_id);
}

export const pagarEnEfectivo: ProcesarVentaTpv = async (contexto, payload) => {

    const pagoEnEfectivo = payload as NuevoPagoEfectivo;
    return await pagar(contexto, pagoEnEfectivo.importe, "EFECTIVO");
}

export const pagarConTarjeta: ProcesarVentaTpv = async (contexto, payload) => {

    const pagoConTarjeta = payload as NuevoPagoEfectivo;
    return await pagar(contexto, pagoConTarjeta.importe, "TARJETA");
}

export const pagar = async (
    contexto: ContextoVentaTpv,
    importe: number,
    formaPago: string,
    idVale?: string
): Promise<ResultadoProcesoContexto<EstadoVentaTpv, ContextoVentaTpv>> => {

    await postPago(
        contexto.venta.id,
        {
            importe,
            formaPago,
            idVale
        }
    );

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarPagos,
        abiertaOEmitidaContexto,
    ]);
}

export const devolverVenta: ProcesarVentaTpv = async (contexto, payload) => {

    const ventaADevolver = payload as VentaTpvADevolver;
    await patchDevolverVenta(contexto.venta.id, ventaADevolver)

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        'ABIERTA',
    ]);
}

export const borrarPago: ProcesarVentaTpv = async (contexto, payload) => {

    const idPago = payload as string;
    await deletePago(contexto.venta.id, idPago);

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

export const borrarVenta: ProcesarVentaTpv = async (contexto) => {

    const venta = contexto.venta;
    await borrarFactura(venta.id);

    return pipeVentaTpv(contexto, [
        getContextoVacio,
        publicar('venta_borrada', venta)
    ]);
}

export const crearLinea: ProcesarVentaTpv = async (contexto, payload) => {

    const nuevaLinea = payload as NuevaLineaFactura;
    const idLinea = await postLinea(contexto.venta.id, nuevaLinea);

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        activarLineaPorId(idLinea),
        'ABIERTA',
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

export const cambiarLinea: ProcesarVentaTpv = async (contexto, payload) => {

    const linea = payload as LineaFactura;
    await patchLinea(contexto.venta.id, linea)

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        'ABIERTA',
    ]);
}


export const borrarLinea: ProcesarVentaTpv = async (contexto, payload) => {

    const idLinea = payload as string;
    await deleteLinea(contexto.venta.id, idLinea);

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

export const cambiarVentaEnLista: ProcesarVentasTpv = async (contexto, payload) => {

    const venta = payload as VentaTpv;
    return {
        ...contexto,
        ventas: contexto.ventas.map(v => v.id === venta.id ? venta : v)
    }
}

export const activarVenta: ProcesarVentasTpv = async (contexto, payload) => {

    const ventaActiva = payload as VentaTpv;
    return {
        ...contexto,
        ventaActiva
    }
}

export const desactivarVentaActiva: ProcesarVentasTpv = async (contexto) => {

    return {
        ...contexto,
        ventaActiva: null
    }
}

export const quitarVentaDeLista: ProcesarVentasTpv = async (contexto, payload) => {

    const ventaBorrada = payload as VentaTpv;
    return {
        ...contexto,
        ventas: contexto.ventas.filter(v => v.id !== ventaBorrada.id),
        ventaActiva: null
    }
}

export const recargarVentas: ProcesarVentasTpv = async (contexto, payload) => {

    const criteria = payload as Criteria;
    const resultado = await getVentas(criteria.filtro, criteria.orden, criteria.paginacion);
    const ventasCargadas = resultado.datos

    return {
        ...contexto,
        ventas: ventasCargadas,
        totalVentas: resultado.total == -1 ? contexto.totalVentas : resultado.total,
        ventaActiva: contexto.ventaActiva
            ? ventasCargadas.find(v => v.id === contexto.ventaActiva?.id) ?? null
            : null
    }
}

export const incluirVentaEnLista: ProcesarVentasTpv = async (contexto, payload) => {

    const venta = payload as VentaTpv;
    return {
        ...contexto,
        ventas: [venta, ...contexto.ventas]
    }
}

export const crearVenta: ProcesarVentasTpv = async (contexto) => {

    const idVenta = await postVenta();
    const venta = await getVenta(idVenta);
    return {
        ...contexto,
        ventas: [venta, ...contexto.ventas],
        ventaActiva: venta
    }
}

