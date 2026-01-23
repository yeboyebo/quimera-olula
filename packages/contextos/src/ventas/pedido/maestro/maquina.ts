import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroPedido, EstadoMaestroPedido } from "./diseño.ts";
import {
    abrirModalCreacion,
    activarPedido,
    cambiarPedidoEnLista,
    cerrarModalCreacion,
    crearPedido,
    desactivarPedidoActivo,
    incluirPedidoEnLista,
    quitarPedidoDeLista,
    recargarPedidos
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoMaestroPedido, ContextoMaestroPedido> = () => {

    return {

        INICIAL: {

            pedido_cambiado: cambiarPedidoEnLista,

            pedido_seleccionado: [activarPedido],

            pedido_deseleccionado: desactivarPedidoActivo,

            pedido_borrado: quitarPedidoDeLista,

            pedido_creado: incluirPedidoEnLista,

            recarga_de_pedidos_solicitada: recargarPedidos,

            creacion_de_pedido_solicitada: crearPedido,

            crear_pedido_solicitado: abrirModalCreacion,
        },

        CREANDO_PEDIDO: {

            pedido_creado: [incluirPedidoEnLista, 'INICIAL'],

            creacion_pedido_cancelada: cerrarModalCreacion,
        },
    }
}
