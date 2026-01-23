import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoPedido, EstadoPedido } from "./diseño.ts";
import {
    abiertoOServido,
    activarLinea,
    borrarLinea,
    borrarPedido,
    cambiarCantidadLinea,
    cambiarCliente,
    cambiarLinea,
    cambiarPedido,
    cancelarCambioPedido,
    cargarContexto,
    crearLinea,
    getContextoVacio,
    refrescarPedido
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoPedido, ContextoPedido> = () => {

    return {

        INICIAL: {

            pedido_id_cambiado: [cargarContexto],

            pedido_deseleccionado: [
                getContextoVacio,
                publicar('pedido_deseleccionado', null)
            ]
        },

        ABIERTO: {

            alta_linea_solicitada: "CREANDO_LINEA",

            baja_linea_solicitada: "BORRANDO_LINEA",

            cambio_linea_solicitado: "CAMBIANDO_LINEA",

            borrar_solicitado: "BORRANDO_PEDIDO",

            cambio_cliente_solicitado: "CAMBIANDO_CLIENTE",

            pedido_cargado: [abiertoOServido],

            pedido_cambiado: [refrescarPedido],

            edicion_de_pedido_lista: [cambiarPedido],

            edicion_de_pedido_cancelada: [cancelarCambioPedido],

            linea_seleccionada: [activarLinea],

            cliente_cambiado: [cambiarCliente],

            cambio_cantidad_linea_solicitado: cambiarCantidadLinea,
        },

        SERVIDO: {

            pedido_cargado: [abiertoOServido],
        },

        BORRANDO_PEDIDO: {

            borrado_de_pedido_listo: borrarPedido,

            borrar_cancelado: "ABIERTO",
        },

        CAMBIANDO_CLIENTE: {

            cambio_cliente_listo: cambiarCliente,

            cambio_cliente_cancelado: "ABIERTO",
        },

        CREANDO_LINEA: {

            alta_linea_lista: [crearLinea],

            alta_linea_cancelada: "ABIERTO",
        },

        CAMBIANDO_LINEA: {

            cambio_linea_listo: cambiarLinea,

            cambio_linea_cancelado: "ABIERTO",
        },

        BORRANDO_LINEA: {

            borrado_linea_listo: borrarLinea,

            borrado_linea_cancelado: "ABIERTO",
        },

    }
}
