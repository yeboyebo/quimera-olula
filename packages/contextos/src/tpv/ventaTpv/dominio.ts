import { Factura } from "#/ventas/factura/diseño.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.ts";
import { cargar, seleccionarItem } from "@olula/lib/entidad.js";

import { nuevaLineaVentaVacia } from "#/ventas/presupuesto/dominio.ts";
import { cambioClienteVentaVacio, metaCambioClienteVenta, metaLineaVenta, metaNuevaLineaVenta, metaVenta, ventaVacia } from "#/ventas/venta/dominio.ts";
import { ProcesarContexto } from "@olula/lib/diseño.js";
import {
    CambioClienteFactura,
    ContextoVentaTpv,
    EstadoVentaTpv,
    LineaFactura,
    NuevaLineaFactura,
    NuevoPagoEfectivo,
    NuevoPagoVale,
    PagoVentaTpv,
    VentaTpv,
    VentaTpvADevolver
} from "./diseño.ts";
import { deletePago, getLineas, getPagos, getVenta, patchDevolverVenta, postEmitirVale, postPago } from "./infraestructura.ts";

export const ventaTpvVacia: VentaTpv = {
    ...ventaVacia,
    pagado: 0,
    pendiente: 0,
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
    return {
        ...contexto,
        venta,
        eventos: [...contexto.eventos, ["venta_cambiada", venta]]
    }
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
        pagos: cargar(pagos)(contexto.pagos),
    }
}

export const refrescarLineas: ProcesarContextoVentaTpv = async (contexto) => {

    const lineas = await getLineas(contexto.venta.id);
    return {
        ...contexto,
        lineas: cargar(lineas)(contexto.lineas),
    }
}

export const seleccionarPago: ProcesarContextoVentaTpv = async (contexto, pago) => {

    return {
        ...contexto,
        pagos: seleccionarItem(pago as PagoVentaTpv)(contexto.pagos)
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

export const pagar = async (contexto: ContextoVentaTpv, importe: number, formaPago: string, idVale?: string): Promise<ContextoVentaTpv> => {

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

    return ejecutarListaProcesos<EstadoVentaTpv, ContextoVentaTpv>(contexto, [
        refrescarVenta,
        refrescarPagos,
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


export const seleccionarLinea: ProcesarContextoVentaTpv = async (contexto, linea) => {

    return {
        ...contexto,
        lineas: seleccionarItem(linea as LineaFactura)(contexto.lineas)
    }
}

export const getContextoVacio: ProcesarContextoVentaTpv = async (contexto) => {

    const listaVaciaPagos: PagoVentaTpv[] = [];
    const listaVaciaLineas: LineaFactura[] = [];

    return {
        ...contexto,
        estado: 'INICIAL',
        venta: ventaTpvVacia,
        pagos: cargar(listaVaciaPagos)(contexto.pagos),
        lineas: cargar(listaVaciaLineas)(contexto.lineas),
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
        ], payload);
    } else {
        return getContextoVacio(contexto);
    }
}

