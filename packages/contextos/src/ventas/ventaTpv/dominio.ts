import { MetaTabla } from "@olula/componentes/index.js";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { cargar, seleccionarItem } from "@olula/lib/entidad.js";
import { pipe } from "@olula/lib/funcional.js";
import { Factura } from "../factura/diseño.ts";

import {
    cambioClienteVentaVacio,
    metaCambioClienteVenta,
    metaLineaVenta,
    metaNuevaLineaVenta,
    metaNuevoPagoEfecctivo,
    metaVenta,
    nuevaLineaVentaVacia,
    ventaVacia
} from "../venta/dominio.ts";
import {
    CambioClienteFactura,
    ContextoVentaTpv,
    EstadoVentaTpv,
    LineaFactura,
    NuevaLineaFactura,
    NuevoPagoEfectivo,
    PagoVentaTpv,
    VentaTpv
} from "./diseño.ts";
import { getLineas, getPagos, getVenta } from "./infraestructura.ts";

export const ventaTpvVacia: VentaTpv = {
    ...ventaVacia,
    pagado: 0,
    pendiente: 0,
};

export const nuevoPagoEfectivoVacio: NuevoPagoEfectivo = {
    importe: 0
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

export const metaNuevoPagoEfectivo: MetaModelo<NuevoPagoEfectivo> = metaNuevoPagoEfecctivo;


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

type ProcesarEvento2 = (evento: string, payload: unknown, contexto: ContextoVentaTpv) =>
    Promise<ContextoVentaTpv>;

type ProcesarContexto = (contexto: ContextoVentaTpv) => ContextoVentaTpv;

export const procesarEvento: ProcesarEvento2 = async (evento, payload, contexto) => {

    const estado = contexto.estado;
    const eventos: [string, unknown][] = [];

    console.log("Procesar evento:", evento, payload, 'estado actual', estado);

    const setEstado: (nuevoEstado: EstadoVentaTpv) => ProcesarContexto = (nuevoEstado: EstadoVentaTpv) => {

        return (contexto: ContextoVentaTpv) => {
            return {
                ...contexto,
                estado: nuevoEstado
            }
        }
    }

    const setVenta: (venta: VentaTpv) => ProcesarContexto = (venta) => {

        return (contexto: ContextoVentaTpv) => {
            return {
                ...contexto,
                venta
            }
        }
    }

    const setPagos: (pagos: PagoVentaTpv[]) => ProcesarContexto = (pagos: PagoVentaTpv[]) => {

        return (contexto: ContextoVentaTpv) => {
            return {
                ...contexto,
                pagos: cargar(pagos)(contexto.pagos),
            }
        }
    }

    const setLineas: (lineas: LineaFactura[]) => ProcesarContexto = (lineas: LineaFactura[]) => {

        return (contexto: ContextoVentaTpv) => {
            return {
                ...contexto,
                lineas: cargar(lineas)(contexto.lineas),
            }
        }
    }

    const setEventos: (eventos: [string, unknown][]) => ProcesarContexto = (eventos) => {

        return (contexto: ContextoVentaTpv) => {
            return {
                ...contexto,
                eventos
            }
        }
    }

    const getContextoVacio: () => ContextoVentaTpv = () => {
        return pipe(
            contexto,
            setEstado('INICIAL'),
            setVenta(ventaTpvVacia),
            setPagos([]),
            setLineas([]),
            setEventos(eventos),
        )
    }

    switch (estado) {

        case "INICIAL":

            switch (evento) {

                case 'venta_id_cambiada':
                    const idVenta = payload as string;
                    if (idVenta) {
                        const venta = await getVenta(idVenta);
                        const pagos = await getPagos(idVenta);
                        const lineas = await getLineas(idVenta);
                        return pipe(
                            contexto,
                            setEstado(abiertaOEmitida(venta)),
                            setVenta(venta),
                            setPagos(pagos),
                            setLineas(lineas),
                        )
                    } else {
                        return getContextoVacio();
                    }

                case 'venta_deseleccionada':
                    eventos.push(['cancelar_seleccion', null]);
                    return getContextoVacio();
            }
            break;

        case "ABIERTA":

            switch (evento) {
                case 'alta_linea_solicitada':
                    return setEstado("CREANDO_LINEA")(contexto);

                case 'baja_linea_solicitada':
                    return setEstado("BORRANDO_LINEA")(contexto);

                case 'cambio_linea_solicitado':
                    return setEstado("CAMBIANDO_LINEA")(contexto);

                case 'borrar_solicitado':
                    return setEstado("BORRANDO_VENTA")(contexto);

                case 'devolucion_solicitada':
                    return setEstado("DEVOLVIENDO_VENTA")(contexto);

                case 'emision_de_vale_solicitada':
                    return setEstado("EMITIENDO_VALE")(contexto);

                case 'pago_efectivo_solicitado':
                    return setEstado("PAGANDO_EFECTIVO")(contexto);

                case 'pago_tarjeta_solicitado':
                    return setEstado("PAGANDO_TARJETA")(contexto);

                case 'borrar_pago_solicitado':
                    return setEstado("BORRANDO_PAGO")(contexto);

                case 'venta_cargada':
                    return pipe(
                        contexto,
                        setEstado(abiertaOEmitida(payload as VentaTpv)),
                    )


                case "venta_cambiada": {
                    const venta = await getVenta(contexto.venta.id);
                    return pipe(
                        contexto,
                        setVenta(venta),
                    )
                }

                case "edicion_de_venta_cancelada": {
                    console.log("edicion de venta cancelada", contexto.ventaInicial);
                    return pipe(
                        contexto,
                        setVenta(contexto.ventaInicial),
                    )
                    // return [estado, contextoVacio(), eventos];
                }

                case 'pago_seleccionado':
                    return {
                        ...contexto,
                        pagos: seleccionarItem(payload as PagoVentaTpv)(contexto.pagos)
                    }

                case 'linea_seleccionada':
                    return {
                        ...contexto,
                        lineas: seleccionarItem(payload as LineaFactura)(contexto.lineas)
                    }

                case 'linea_creada':
                    const lineas = await getLineas(contexto.venta.id);
                    const venta = await getVenta(contexto.venta.id);
                    const contextoNuevo: ContextoVentaTpv = { ...contexto, venta, lineas: cargar(lineas)(contexto.lineas) };
                    eventos.push(["venta_cambiada", venta]);
                    return pipe(
                        contextoNuevo,
                        setEstado(abiertaOEmitida(venta)),
                        setVenta(venta),
                        setLineas(lineas),
                        setEventos(eventos),
                    )
            }
            break;


        case "EMITIDA":
            switch (evento) {
                case 'venta_cargada':
                    return pipe(
                        contexto,
                        setEstado(abiertaOEmitida(payload as VentaTpv)),
                    )
            }
            break;

        case "BORRANDO_VENTA":

            switch (evento) {

                case 'venta_borrada':
                    eventos.push(["factura_borrada", null]);
                    return pipe(
                        contexto,
                        setEstado('INICIAL'),
                        setVenta(ventaTpvVacia),
                        setPagos([]),
                        setLineas([]),
                        setEventos(eventos),
                    )

                case 'borrar_cancelado':
                    return setEstado("ABIERTA")(contexto);
            }
            break;

        case "PAGANDO_TARJETA":
        case "PAGANDO_EFECTIVO":

            switch (evento) {

                case 'pago_creado':
                    return pipe(
                        contexto,
                        setEstado(abiertaOEmitida(payload as VentaTpv)),
                    )

                case 'pago_cancelado':
                    return pipe(
                        contexto,
                        setEstado('ABIERTA'),
                    )
            }
            break;


        case "BORRANDO_PAGO":

            switch (evento) {

                case 'pago_borrado':
                    const pagos = await getPagos(contexto.venta.id);
                    const venta = await getVenta(contexto.venta.id);
                    return pipe(
                        contexto,
                        setEstado('ABIERTA'),
                        setVenta(venta),
                        setPagos(pagos),
                    )

                case 'pago_borrado_cancelado':
                    return pipe(
                        contexto,
                        setEstado('ABIERTA'),
                    )
            }
            break;

        case "DEVOLVIENDO_VENTA":

            switch (evento) {

                case 'venta_devuelta':
                case 'devolucion_cancelada':
                    return pipe(
                        contexto,
                        setEstado('ABIERTA'),
                    )
            }
            break;

        case "CREANDO_LINEA":

            switch (evento) {

                case 'linea_creada':
                    const lineas = await getLineas(contexto.venta.id);
                    const venta = await getVenta(contexto.venta.id);
                    return pipe(
                        contexto,
                        setEstado('ABIERTA'),
                        setVenta(venta),
                        setLineas(lineas),
                    )

                case 'alta_linea_cancelada':
                    return pipe(
                        contexto,
                        setEstado('ABIERTA'),
                    )
            }
            break;

        case "CAMBIANDO_LINEA":
            switch (evento) {
                case 'linea_cambiada':
                    const lineas = await getLineas(contexto.venta.id);
                    const venta = await getVenta(contexto.venta.id);
                    return pipe(
                        contexto,
                        setEstado('ABIERTA'),
                        setVenta(venta),
                        setLineas(lineas),
                    )

                case 'cambio_linea_cancelado':
                    return pipe(
                        contexto,
                        setEstado('ABIERTA'),
                    )
            }
            break;

        case "BORRANDO_LINEA":
            switch (evento) {
                case 'linea_borrada':
                    const lineas = await getLineas(contexto.venta.id);
                    const venta = await getVenta(contexto.venta.id);
                    return pipe(
                        contexto,
                        setEstado('ABIERTA'),
                        setVenta(venta),
                        setLineas(lineas),
                    )

                case 'baja_linea_cancelada':
                    return pipe(
                        contexto,
                        setEstado('ABIERTA'),
                    )
            }
            break;

        case "EMITIENDO_VALE":
            switch (evento) {
                case 'vale_emitido':
                    const pagos = await getPagos(contexto.venta.id);
                    const venta = await getVenta(contexto.venta.id);
                    return pipe(
                        contexto,
                        setEstado(abiertaOEmitida(venta)),
                        setVenta(venta),
                        setPagos(pagos),
                    )

                case 'emision_de_vale_cancelada':
                    return pipe(
                        contexto,
                        setEstado('ABIERTA'),
                    )
            }
            break;
    }
    return contexto;
};

const abiertaOEmitida = (payload: unknown) => {
    const venta = payload as VentaTpv;
    return venta.abierta ? "ABIERTA" : "EMITIDA";
}