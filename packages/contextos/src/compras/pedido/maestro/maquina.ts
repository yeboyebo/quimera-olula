import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroPedido, EstadoMaestroPedido } from "./diseño.ts";
import * as maestro from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroPedido, ContextoMaestroPedido> = () => {
    return {
        INICIAL: {
            pedido_seleccionado: [maestro.Pedidos.activar],
            pedido_deseleccionado: [maestro.Pedidos.desactivar],

            pedido_cambiado: [maestro.Pedidos.cambiar],
            pedido_borrado: [maestro.Pedidos.quitar],

            recarga_de_pedidos_solicitada: maestro.recargarPedidos,

            criteria_cambiado: [maestro.Pedidos.filtrar, maestro.recargarPedidos],

            siguiente_pagina: [maestro.Pedidos.filtrar, maestro.ampliarPedidos],

            crear_pedido_solicitado: "CREANDO",

            seleccionados_cambiados: maestro.seleccionadosCambiados,
            albaranado_solicitado: "ALBARANANDO",
        },

        ALBARANANDO: {
            albaranado_confirmado: maestro.albaranarSeleccionados,
            albaranado_cancelado: "INICIAL",
        },

        CREANDO: {
            alta_de_pedido_cancelada: "INICIAL",

            pedido_creado: maestro.incluirPedidoCreadoPorId,
        },
    };
};
