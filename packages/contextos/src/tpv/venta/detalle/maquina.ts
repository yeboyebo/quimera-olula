import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoVentaTpv, EstadoVentaTpv } from "../diseño.ts";
import { abiertaOEmitidaContexto, activarLinea, activarPago, cambiarVenta, cancelarcambioVenta, cargarContexto, crearLineaPorBarcode, emitirVale, getContextoVacio, onLineaBorrada, onLineaCambiada, onLineaCreada, onPagoBorrado, onVentaBorrada, refrescarLineas, refrescarPagos, refrescarVenta } from "./detalle.ts";


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

            pago_seleccionado: [activarPago],

            linea_seleccionada: [activarLinea],
        },

        BORRANDO_VENTA: {

            // borrado_de_venta_listo: borrarVenta,
            venta_borrada: onVentaBorrada,

            borrar_cancelado: "ABIERTA",
        },

        PAGANDO_EN_EFECTIVO: {

            // pago_en_efectivo_listo: pagarEnEfectivo,
            pago_en_efectivo_hecho: [
                refrescarVenta,
                refrescarPagos,
                abiertaOEmitidaContexto,
            ],

            pago_cancelado: "ABIERTA",
        },

        PAGANDO_CON_VALE: {

            // pago_con_vale_listo: pagarConVale,
            pago_con_vale_hecho: [
                refrescarVenta,
                refrescarPagos,
                abiertaOEmitidaContexto,
            ],

            pago_cancelado: "ABIERTA",
        },

        PAGANDO_CON_TARJETA: {

            // pago_con_tarjeta_listo: pagarConTarjeta,
            pago_con_tarjeta_hecho: [
                refrescarVenta,
                refrescarPagos,
                abiertaOEmitidaContexto,
            ],

            pago_cancelado: "ABIERTA",
        },

        BORRANDO_PAGO: {

            // borrado_de_pago_listo: borrarPago,
            pago_borrado: [onPagoBorrado, "ABIERTA"],

            borrado_de_pago_cancelado: "ABIERTA",
        },

        DEVOLVIENDO_VENTA: {

            // devolucion_lista: devolverVenta,
            devolucion_hecha: [refrescarVenta, refrescarLineas, "ABIERTA"],

            devolucion_cancelada: "ABIERTA",
        },

        CREANDO_LINEA: {

            // alta_de_linea_lista: crearLinea,
            linea_creada: [onLineaCreada, "ABIERTA"],

            alta_de_linea_cancelada: "ABIERTA",
        },

        CAMBIANDO_LINEA: {

            // cambio_de_linea_listo: cambiarLinea,
            linea_cambiada: [onLineaCambiada, "ABIERTA"],

            cambio_de_linea_cancelado: "ABIERTA",
        },

        BORRANDO_LINEA: {

            // borrado_de_linea_listo: borrarLinea,
            linea_borrada: [onLineaBorrada, "ABIERTA"],

            borrado_de_linea_cancelado: "ABIERTA",
        },
    }
}