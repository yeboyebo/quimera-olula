import { Factura } from "#/ventas/factura/diseño.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { ejecutarListaProcesos, MetaModelo, publicar } from "@olula/lib/dominio.ts";

import { nuevaLineaVentaVacia } from "#/ventas/presupuesto/dominio.ts";
import { cambioClienteVentaVacio, metaCambioClienteVenta, metaLineaVenta, metaNuevaLineaVenta, metaVenta, ventaVacia } from "#/ventas/venta/dominio.ts";
import { EventoMaquina, Filtro, Orden, Paginacion, ProcesarContexto } from "@olula/lib/diseño.js";
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
    vale_id: ""
}


export const cambioClienteFacturaVacio: CambioClienteFactura = cambioClienteVentaVacio;

export const nuevaLineaFacturaVacia: NuevaLineaFactura = nuevaLineaVentaVacia;

export const metaCambioClienteFactura: MetaModelo<CambioClienteFactura> = metaCambioClienteVenta;

export const metaVentaTpv: MetaModelo<VentaTpv> = {
    campos: {
        fecha: { tipo: "fecha", requerido: false },
        ...metaVenta.campos,
    },
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
        id: "nombre_cliente",
        cabecera: "Cliente",
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
    },
];

type ProcesarContextoVentaTpv = ProcesarContexto<EstadoVentaTpv, ContextoVentaTpv>;
type ProcesarContextoMaestroVentasTpv = ProcesarContexto<EstadoMaestroVentasTpv, ContextoMaestroVentasTpv>;

const cargarVenta: (idVenta: string) => ProcesarContextoVentaTpv = (idVenta) =>
    async (contexto) => {

        const venta = await getVenta(idVenta);
        return {
            ...contexto,
            venta,
        }
    }

export const refrescarVenta: ProcesarContextoVentaTpv = async (contexto) => {

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

export const cancelarcambioVenta: ProcesarContextoVentaTpv = async (contexto) => {

    return {
        ...contexto,
        venta: contexto.ventaInicial
    }
}

export const abiertaOEmitidaContexto: ProcesarContextoVentaTpv = async (contexto) => {
    return {
        ...contexto,
        estado: contexto.venta.abierta ? "ABIERTA" : "EMITIDA"
    }
}

export const refrescarPagos: ProcesarContextoVentaTpv = async (contexto) => {

    const pagos = await getPagos(contexto.venta.id);
    return {
        ...contexto,
        venta: {
            ...contexto.venta,
            pagos,
        },
        // pagos: cargar(pagos)(contexto.pagos),
    }
}

export const refrescarLineas: ProcesarContextoVentaTpv = async (contexto) => {

    const lineas = await getLineas(contexto.venta.id);
    return {
        ...contexto,
        venta: {
            ...contexto.venta,
            lineas
        }
    }
}

export const activarPago: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const pagoActivo = payload as PagoVentaTpv;
    return {
        ...contexto,
        pagoActivo
    }
}

const activarPagoPorIndice = (indice: number) => async (contexto: ContextoVentaTpv) => {

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


export const pagarConVale: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const pagoConVale = payload as NuevoPagoVale;
    return await pagar(contexto, pagoConVale.importe, "VALE", pagoConVale.vale_id);
}

export const pagarEnEfectivo: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const pagoEnEfectivo = payload as NuevoPagoEfectivo;
    return await pagar(contexto, pagoEnEfectivo.importe, "EFECTIVO");
}

export const pagarConTarjeta: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const pagoConTarjeta = payload as NuevoPagoEfectivo;
    return await pagar(contexto, pagoConTarjeta.importe, "TARJETA");
}

export const pagar = async (contexto: ContextoVentaTpv, importe: number, formaPago: string, idVale?: string): Promise<ContextoVentaTpv | [ContextoVentaTpv, EventoMaquina[]]> => {

    await postPago(
        contexto.venta.id,
        {
            importe,
            formaPago,
            idVale
        }
    );

    return ejecutarListaProcesos(contexto, [
        refrescarVenta,
        refrescarPagos,
        abiertaOEmitidaContexto,
    ]);
}

export const devolverVenta: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const ventaADevolver = payload as VentaTpvADevolver;
    await patchDevolverVenta(contexto.venta.id, ventaADevolver)

    return ejecutarListaProcesos<EstadoVentaTpv, ContextoVentaTpv>(contexto, [
        refrescarVenta,
        refrescarLineas,
        'ABIERTA',
    ]);
}

export const borrarPago: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const idPago = payload as string;
    await deletePago(contexto.venta.id, idPago);

    const indicePagoActivo = contexto.venta.pagos.findIndex(l => l.id === idPago);

    return ejecutarListaProcesos<EstadoVentaTpv, ContextoVentaTpv>(contexto, [
        refrescarVenta,
        refrescarPagos,
        activarPagoPorIndice(indicePagoActivo),
        'ABIERTA',
    ]);
}

export const cambiarVenta: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const venta = payload as VentaTpv;
    await patchFactura(contexto.venta.id, venta)

    return ejecutarListaProcesos<EstadoVentaTpv, ContextoVentaTpv>(contexto, [
        refrescarVenta,
        'ABIERTA',
    ]);
}

export const borrarVenta: ProcesarContextoVentaTpv = async (contexto) => {

    await borrarFactura(contexto.venta.id);

    return ejecutarListaProcesos<EstadoVentaTpv, ContextoVentaTpv>(contexto, [
        getContextoVacio,
        publicar('venta_borrada', null)
    ]);
}

export const crearLinea: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const nuevaLinea = payload as NuevaLineaFactura;
    const idLinea = await postLinea(contexto.venta.id, nuevaLinea);

    return ejecutarListaProcesos<EstadoVentaTpv, ContextoVentaTpv>(contexto, [
        refrescarVenta,
        refrescarLineas,
        activarLineaPorId(idLinea),
        'ABIERTA',
    ]);
}

export const crearLineaPorBarcode: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const barcode = payload as string;
    const idLinea = await postLineaPorBarcode(contexto.venta.id, {
        barcode,
        cantidad: 1
    });

    return ejecutarListaProcesos<EstadoVentaTpv, ContextoVentaTpv>(contexto, [
        refrescarVenta,
        refrescarLineas,
        activarLineaPorId(idLinea),
        'ABIERTA',
    ]);
}

export const cambiarLinea: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const linea = payload as LineaFactura;
    await patchLinea(contexto.venta.id, linea)

    return ejecutarListaProcesos<EstadoVentaTpv, ContextoVentaTpv>(contexto, [
        refrescarVenta,
        refrescarLineas,
        'ABIERTA',
    ]);
}


export const borrarLinea: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const idLinea = payload as string;
    await deleteLinea(contexto.venta.id, idLinea);

    const indiceLineaActiva = contexto.venta.lineas.findIndex(l => l.id === idLinea);

    return ejecutarListaProcesos<EstadoVentaTpv, ContextoVentaTpv>(contexto, [
        refrescarVenta,
        refrescarLineas,
        activarLineaPorIndice(indiceLineaActiva),
        'ABIERTA',
    ]);
}

export const emitirVale: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const venta = payload as VentaTpv
    await postEmitirVale(venta)

    return ejecutarListaProcesos<EstadoVentaTpv, ContextoVentaTpv>(contexto, [
        refrescarVenta,
        refrescarPagos,
        abiertaOEmitidaContexto,
    ]);
}


export const activarLinea: ProcesarContextoVentaTpv = async (contexto, payload) => {

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

export const getContextoVacio: ProcesarContextoVentaTpv = async (contexto) => {

    return {
        ...contexto,
        estado: 'INICIAL',
        venta: ventaTpvVacia,
        pagoActivo: null,
        lineaActiva: null
    }
}

export const cargarContexto: ProcesarContextoVentaTpv = async (contexto, payload) => {

    const idVenta = payload as string;
    if (idVenta) {
        return ejecutarListaProcesos(contexto, [
            cargarVenta(idVenta),
            refrescarPagos,
            refrescarLineas,
            abiertaOEmitidaContexto,
            activarLineaPorIndice(0),
            activarPagoPorIndice(0),
        ], payload);
    } else {
        return getContextoVacio(contexto);
    }
}

export const cambiarVentaEnLista: ProcesarContextoMaestroVentasTpv = async (contexto, payload) => {

    const venta = payload as VentaTpv;
    return {
        ...contexto,
        ventas: contexto.ventas.map(v => v.id === venta.id ? venta : v)
    }
}

export const cambiarVentaEnLista2: ProcesarContextoMaestroVentasTpv = async (contexto, payload) => {

    const venta = payload as VentaTpv;
    return [
        {
            ...contexto,
            ventas: contexto.ventas.map(v => v.id === venta.id ? venta : v)
        },
        []
    ]
}

export const activarVenta: ProcesarContextoMaestroVentasTpv = async (contexto, payload) => {

    const ventaActiva = payload as VentaTpv;
    return {
        ...contexto,
        ventaActiva
    }
}

export const desactivarVentaActiva: ProcesarContextoMaestroVentasTpv = async (contexto) => {

    return {
        ...contexto,
        ventaActiva: null
    }
}

export const quitarVentaDeLista: ProcesarContextoMaestroVentasTpv = async (contexto, payload) => {

    const ventaBorrada = payload as VentaTpv;
    return {
        ...contexto,
        ventas: contexto.ventas.filter(v => v.id !== ventaBorrada.id),
        ventaActiva: null
    }
}

export const recargarVentas: ProcesarContextoMaestroVentasTpv = async (contexto, payload) => {

    const paramsRecarga = payload as {
        filtro: Filtro,
        orden: Orden,
        paginacion: Paginacion
    }
    const resultado = await getVentas(paramsRecarga.filtro, paramsRecarga.orden, paramsRecarga.paginacion);
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

export const incluirVentaEnLista: ProcesarContextoMaestroVentasTpv = async (contexto, payload) => {

    const venta = payload as VentaTpv;
    return {
        ...contexto,
        ventas: [venta, ...contexto.ventas]
    }
}

export const crearVenta: ProcesarContextoMaestroVentasTpv = async (contexto) => {

    const idVenta = await postVenta();
    const venta = await getVenta(idVenta);
    return {
        ...contexto,
        ventas: [venta, ...contexto.ventas],
        ventaActiva: venta
    }
}

