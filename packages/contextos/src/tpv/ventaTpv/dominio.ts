import { Factura } from "#/ventas/factura/diseño.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { cargar, seleccionarItem } from "@olula/lib/entidad.js";

import { nuevaLineaVentaVacia } from "#/ventas/presupuesto/dominio.ts";
import { cambioClienteVentaVacio, metaCambioClienteVenta, metaLineaVenta, metaNuevaLineaVenta, metaVenta, ventaVacia } from "#/ventas/venta/dominio.ts";
import {
    CambioClienteFactura,
    ContextoVentaTpv,
    EstadoVentaTpv,
    LineaFactura,
    metaNuevoPagoEfecctivo,
    NuevaLineaFactura,
    NuevoPagoEfectivo,
    NuevoPagoVale,
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
type ProcesarContextoAsync = (contexto: ContextoVentaTpv, payload?: unknown) => Promise<ContextoVentaTpv>;

export const procesarEvento: ProcesarEvento2 = async (evento, payload, contexto) => {

    const estado = contexto.estado;

    console.log("Procesar evento:", evento, payload, 'estado actual', estado);

    const setEstado: (nuevoEstado: EstadoVentaTpv) => ProcesarContexto = (nuevoEstado: EstadoVentaTpv) => {

        return (contexto: ContextoVentaTpv) => {
            return {
                ...contexto,
                estado: nuevoEstado
            }
        }
    }

    const cargarVenta: (idVenta: string) => ProcesarContextoAsync = (idVenta: string) =>
        async (contexto) => {

            const venta = await getVenta(idVenta);
            return {
                ...contexto,
                venta,
            }
        }

    const refrescarVenta: ProcesarContextoAsync = async (contexto) => {

        const venta = await getVenta(contexto.venta.id);
        return {
            ...contexto,
            venta,
            eventos: [...contexto.eventos, ["venta_cambiada", venta]]
        }
    }

    const abiertaOEmitidaContexto: ProcesarContextoAsync = async (contexto) => {
        return {
            ...contexto,
            estado: abiertaOEmitida(contexto.venta),
        }
    }

    const refrescarPagos: ProcesarContextoAsync = async (contexto) => {

        const pagos = await getPagos(contexto.venta.id);
        return {
            ...contexto,
            pagos: cargar(pagos)(contexto.pagos),
        }
    }

    const refrescarLineas: ProcesarContextoAsync = async (contexto) => {

        const lineas = await getLineas(contexto.venta.id);
        return {
            ...contexto,
            lineas: cargar(lineas)(contexto.lineas),
        }
    }

    const seleccionarPago: ProcesarContextoAsync = async (contexto, pago) => {

        return {
            ...contexto,
            pagos: seleccionarItem(pago as PagoVentaTpv)(contexto.pagos)
        }
    }

    const seleccionarLinea: (linea: LineaFactura) => ProcesarContextoAsync = (linea) =>
        async (contexto) => {

            return {
                ...contexto,
                lineas: seleccionarItem(linea)(contexto.lineas)
            }
        }

    const getContextoVacio: ProcesarContextoAsync = async (contexto) => {

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

    const publicar: (evento: string, payload: unknown) => ProcesarContextoAsync = (evento, payload) =>

        async (contexto) => {

            return {
                ...contexto,
                eventos: [...contexto.eventos, [evento, payload]]
            }
        }

    const usarMaquina: () => Promise<ContextoVentaTpv | EstadoVentaTpv | (ProcesarContextoAsync | EstadoVentaTpv)[]> = async () => {

        switch (estado) {

            case "INICIAL":

                switch (evento) {

                    case 'venta_id_cambiada':
                        const idVenta = payload as string;
                        if (idVenta) {
                            return [
                                cargarVenta(idVenta),
                                refrescarPagos,
                                refrescarLineas,
                                abiertaOEmitidaContexto,
                            ]
                        } else {
                            return [getContextoVacio];
                        }

                    case 'venta_deseleccionada':
                        return [
                            getContextoVacio,
                            publicar('cancelar_seleccion', null)
                        ]
                }
                break;

            case "ABIERTA":

                switch (evento) {
                    case 'alta_linea_solicitada':
                        return "CREANDO_LINEA";

                    case 'baja_linea_solicitada':
                        return "BORRANDO_LINEA";

                    case 'cambio_linea_solicitado':
                        return "CAMBIANDO_LINEA";

                    case 'borrar_solicitado':
                        return "BORRANDO_VENTA";

                    case 'devolucion_solicitada':
                        return "DEVOLVIENDO_VENTA";

                    case 'emision_de_vale_solicitada':
                        return "EMITIENDO_VALE";

                    case 'pago_efectivo_solicitado':
                        return "PAGANDO_EN_EFECTIVO";

                    case 'pago_vale_solicitado':
                        return "PAGANDO_CON_VALE";

                    case 'pago_tarjeta_solicitado':
                        return "PAGANDO_CON_TARJETA"

                    case 'borrar_pago_solicitado':
                        return "BORRANDO_PAGO"

                    case 'venta_cargada':
                        return abiertaOEmitida(payload as VentaTpv)

                    case "venta_cambiada": {
                        return [refrescarVenta]
                    }

                    case "edicion_de_venta_cancelada": {
                        return {
                            ...contexto,
                            venta: contexto.ventaInicial,
                        }
                    }

                    case 'pago_seleccionado':
                        // return [seleccionarPago(payload as PagoVentaTpv)]
                        return [seleccionarPago]


                    case 'linea_seleccionada':
                        return [seleccionarLinea(payload as LineaFactura)]

                    case 'linea_creada':
                        return [
                            refrescarVenta,
                            refrescarLineas
                        ]
                }
                break;


            case "EMITIDA":
                switch (evento) {
                    case 'venta_cargada':
                        return abiertaOEmitida(payload as VentaTpv);
                }
                break;

            case "BORRANDO_VENTA":

                switch (evento) {

                    case 'venta_borrada':
                        return [
                            getContextoVacio,
                            publicar('factura_borrada', null)
                        ]

                    case 'borrar_cancelado':
                        return "ABIERTA";
                }
                break;

            case "PAGANDO_CON_TARJETA":
            case "PAGANDO_EN_EFECTIVO":
            case "PAGANDO_CON_VALE":

                switch (evento) {

                    case 'pago_creado':
                        return [
                            refrescarVenta,
                            refrescarPagos,
                            abiertaOEmitidaContexto
                        ]

                    case 'pago_cancelado':
                        return 'ABIERTA';
                }
                break;


            case "BORRANDO_PAGO":

                switch (evento) {

                    case 'pago_borrado':
                        return [
                            "ABIERTA",
                            refrescarVenta,
                            refrescarPagos
                        ]

                    case 'pago_borrado_cancelado':
                        return 'ABIERTA';
                }
                break;

            case "DEVOLVIENDO_VENTA":

                switch (evento) {

                    case 'venta_devuelta':
                        return [
                            "ABIERTA",
                            refrescarVenta,
                            refrescarLineas
                        ]

                    case 'devolucion_cancelada':
                        return 'ABIERTA';
                }
                break;

            case "CREANDO_LINEA":

                switch (evento) {

                    case 'linea_creada':
                        return [
                            "ABIERTA",
                            refrescarVenta,
                            refrescarLineas
                        ]

                    case 'alta_linea_cancelada':
                        return 'ABIERTA';
                }
                break;

            case "CAMBIANDO_LINEA":
                switch (evento) {
                    case 'linea_cambiada':
                        return [
                            "ABIERTA",
                            refrescarVenta,
                            refrescarLineas
                        ]

                    case 'cambio_linea_cancelado':
                        return 'ABIERTA';
                }
                break;

            case "BORRANDO_LINEA":
                switch (evento) {
                    case 'linea_borrada':
                        return [
                            "ABIERTA",
                            refrescarVenta,
                            refrescarLineas
                        ]

                    case 'baja_linea_cancelada':
                        return 'ABIERTA';
                }
                break;

            case "EMITIENDO_VALE":
                switch (evento) {
                    case 'vale_emitido':
                        return [
                            "ABIERTA",
                            refrescarVenta,
                            refrescarPagos
                        ]

                    case 'emision_de_vale_cancelada':
                        return 'ABIERTA';
                }
                break;
        }
        return contexto;
    }

    const resultado = await usarMaquina();

    if (typeof resultado === 'string') {
        return setEstado(resultado)(contexto);
    }
    else if (Array.isArray(resultado)) {
        let nuevoContexto = contexto;
        for (const proceso of resultado as ProcesarContextoAsync[]) {
            if (typeof proceso === 'string') {
                nuevoContexto = setEstado(proceso)(nuevoContexto);
            } else {
                nuevoContexto = await proceso(nuevoContexto, payload);
            }
        }
        return nuevoContexto;
    } else {
        return resultado;
    }
};

const abiertaOEmitida = (payload: unknown) => {
    const venta = payload as VentaTpv;
    return venta.abierta ? "ABIERTA" : "EMITIDA";
}