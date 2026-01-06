import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoVentaTpv, EstadoVentaTpv } from "./diseño.ts";
import {
    abiertaOEmitidaContexto,
    activarLinea,
    activarPago,
    borrarLinea,
    borrarPago,
    borrarVenta,
    cambiarLinea,
    cambiarVenta,
    cancelarcambioVenta,
    cargarContexto,
    crearLinea,
    crearLineaPorBarcode,
    devolverVenta,
    emitirVale,
    getContextoVacio,
    pagarConTarjeta,
    pagarConVale,
    pagarEnEfectivo,
    refrescarLineas,
    refrescarVenta
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoVentaTpv, ContextoVentaTpv> = () => {

    return {

        INICIAL: {

            venta_id_cambiada: [cargarContexto],

            venta_deseleccionada: [
                getContextoVacio,
                publicar('venta_deselaccionada', null)
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

            edicion_de_venta_lista: [cambiarVenta],

            edicion_de_venta_cancelada: [cancelarcambioVenta],

            pago_seleccionado: [activarPago],

            linea_seleccionada: [activarLinea],

            alta_de_linea_por_barcode_lista: crearLineaPorBarcode,
        },

        EMITIDA: {

            venta_cargada: [abiertaOEmitidaContexto],
        },

        BORRANDO_VENTA: {

            borrado_de_venta_listo: borrarVenta,

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

            borrado_de_pago_listo: borrarPago,

            pago_borrado_cancelado: "ABIERTA",
        },

        DEVOLVIENDO_VENTA: {

            devolucion_lista: devolverVenta,

            devolucion_cancelada: "ABIERTA",
        },

        CREANDO_LINEA: {

            alta_de_linea_lista: crearLinea,

            alta_de_linea_cancelada: "ABIERTA",
        },

        CAMBIANDO_LINEA: {

            cambio_de_linea_listo: cambiarLinea,

            cambio_de_linea_cancelado: "ABIERTA",
        },

        BORRANDO_LINEA: {

            borrado_de_linea_listo: borrarLinea,

            borrado_de_linea_cancelado: "ABIERTA",
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