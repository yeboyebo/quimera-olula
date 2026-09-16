import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoVentaTpv, EstadoVentaTpv } from "./diseño.ts";
import {
    abiertaOCerrada,
    activarLinea,
    borrarLinea,
    borrarPago,
    borrarVenta,
    cambiarCantidadLinea,
    cambiarCliente,
    cambiarDatosCliente,
    cambiarDescuento,
    cambiarLinea,
    cargarContexto,
    crearLinea,
    crearLineaYPagar,
    getContextoVacio,
    Pagos,
    pagoHecho,
    refrescarVenta
} from "./detalle.ts";


export const getMaquina = (): Maquina<EstadoVentaTpv, ContextoVentaTpv> => {

    return {

        INICIAL: {

            venta_id_cambiada: [cargarContexto],

            venta_deseleccionada: [
                getContextoVacio,
                publicar('venta_deseleccionada', null)
            ]
        },

        ABIERTO: {

            alta_linea_solicitada: "CREANDO_LINEA",

            baja_linea_solicitada: "BORRANDO_LINEA",

            cambio_linea_solicitado: "CAMBIANDO_LINEA",

            borrar_solicitado: "BORRANDO_VENTA",

            // Igual que en Eneboo: al pulsar Pago se ofrece primero
            // añadir bolsas, y solo al cerrar ese popup (con o sin
            // bolsas) se abre el de pago.
            pago_solicitado: "AÑADIENDO_BOLSAS_PARA_PAGAR",

            borrar_pago_solicitado: "BORRANDO_PAGO",

            pago_seleccionado: [Pagos.activar],

            cambio_cliente_listo: [cambiarCliente],

            datos_cliente_listo: [cambiarDatosCliente],

            descuento_solicitado: "CAMBIANDO_DESCUENTO",

            venta_cargada: [abiertaOCerrada],

            venta_cambiada: [refrescarVenta],

            linea_seleccionada: [activarLinea],

            cambio_cantidad_linea_solicitado: cambiarCantidadLinea,

            // Permite crear una línea sin pasar por el modal (p.ej. al
            // escanear un código de barras directamente en el listado).
            alta_linea_lista: [crearLinea],

            venta_deseleccionada: [
                getContextoVacio,
                publicar('venta_deseleccionada', null)
            ]
        },

        SERVIDO: {

            venta_cargada: [abiertaOCerrada],

            venta_deseleccionada: [
                getContextoVacio,
                publicar('venta_deseleccionada', null)
            ]
        },

        BORRANDO_VENTA: {

            borrado_de_venta_listo: borrarVenta,

            borrar_cancelado: "ABIERTO",
        },

        CAMBIANDO_DESCUENTO: {

            descuento_aplicado: [cambiarDescuento],

            descuento_cancelado: "ABIERTO",
        },

        CREANDO_LINEA: {

            alta_linea_lista: [crearLinea],

            crear_linea_cancelado: "ABIERTO",
        },

        AÑADIENDO_BOLSAS_PARA_PAGAR: {

            alta_linea_lista: [crearLineaYPagar],

            bolsas_cancelado: "PAGANDO",
        },

        CAMBIANDO_LINEA: {

            linea_actualizada: cambiarLinea,

            editar_linea_cancelado: "ABIERTO",
        },

        BORRANDO_LINEA: {

            linea_borrada: borrarLinea,

            borrar_linea_cancelado: "ABIERTO",
        },

        PAGANDO: {

            pago_hecho: [pagoHecho],

            pago_cancelado: "ABIERTO",
        },

        BORRANDO_PAGO: {

            pago_borrado: [borrarPago],

            borrado_de_pago_cancelado: "ABIERTO",
        },

    }
}
