import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoVentaTpv, EstadoVentaTpv } from "./diseño.ts";
import {
    abiertaOEmitidaContexto,
    borrarPago,
    cancelarcambioVenta,
    cargarContexto,
    devolverVenta,
    emitirVale,
    getContextoVacio,
    pagarConTarjeta,
    pagarConVale,
    pagarEnEfectivo,
    refrescarLineas,
    refrescarVenta,
    seleccionarLinea,
    seleccionarPago
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoVentaTpv, ContextoVentaTpv> = () => {

    return {

        INICIAL: {

            venta_id_cambiada: [cargarContexto],

            venta_deseleccionada: [
                getContextoVacio,
                publicar('cancelar_seleccion', null)
            ]
        },

        ABIERTA: {

            linea_creada: [
                refrescarVenta,
                refrescarLineas
            ],

            alta_linea_solicitada: "CREANDO_LINEA",

            baja_linea_solicitada: "BORRANDO_LINEA",

            cambio_linea_solicitado: "CAMBIANDO_LINEA",

            borrar_solicitado: "BORRANDO_VENTA",

            devolucion_solicitada: "DEVOLVIENDO_VENTA",

            emision_de_vale_solicitada: emitirVale,

            pago_efectivo_solicitado: "PAGANDO_EN_EFECTIVO",

            pago_vale_solicitado: "PAGANDO_CON_VALE",

            pago_tarjeta_solicitado: "PAGANDO_CON_TARJETA",

            borrar_pago_solicitado: "BORRANDO_PAGO",

            venta_cargada: [abiertaOEmitidaContexto],

            venta_cambiada: [refrescarVenta],

            edicion_de_venta_cancelada: [cancelarcambioVenta],

            pago_seleccionado: [seleccionarPago],

            linea_seleccionada: [seleccionarLinea]
        },

        EMITIDA: {

            venta_cargada: [abiertaOEmitidaContexto],
        },

        BORRANDO_VENTA: {

            venta_borrada: [
                getContextoVacio,
                publicar('factura_borrada', null)
            ],

            borrar_cancelado: "ABIERTA",
        },

        PAGANDO_EN_EFECTIVO: {

            pago_en_efectivo_listo: pagarEnEfectivo,

            pago_cancelado: "ABIERTA",
        },

        PAGANDO_CON_VALE: {

            pago_con_vale_listo: pagarConVale,

            pago_cancelado: "ABIERTA",
        },

        PAGANDO_CON_TARJETA: {

            pago_con_tarjeta_listo: pagarConTarjeta,

            pago_cancelado: "ABIERTA",
        },

        BORRANDO_PAGO: {

            // pago_borrado: [
            //     "ABIERTA",
            //     refrescarVenta,
            //     refrescarPagos
            // ],
            borrado_de_pago_listo: borrarPago,

            pago_borrado_cancelado: "ABIERTA",
        },

        DEVOLVIENDO_VENTA: {

            // venta_devuelta: [
            //     "ABIERTA",
            //     refrescarVenta,
            //     refrescarLineas
            // ],
            devolucion_lista: devolverVenta,

            devolucion_cancelada: "ABIERTA",
        },

        CREANDO_LINEA: {

            linea_creada: [
                "ABIERTA",
                refrescarVenta,
                refrescarLineas
            ],

            alta_linea_cancelada: "ABIERTA",
        },

        CAMBIANDO_LINEA: {

            linea_cambiada: [
                "ABIERTA",
                refrescarVenta,
                refrescarLineas
            ],

            cambio_linea_cancelado: "ABIERTA",
        },

        BORRANDO_LINEA: {

            linea_borrada: [
                "ABIERTA",
                refrescarVenta,
                refrescarLineas
            ],

            baja_linea_cancelada: "ABIERTA",
        },

        // EMITIENDO_VALE: {

        //     vale_emitido: [
        //         "ABIERTA",
        //         refrescarVenta,
        //         refrescarPagos
        //     ],

        //     emision_de_vale_cancelada: "ABIERTA",
        // },
    }
}