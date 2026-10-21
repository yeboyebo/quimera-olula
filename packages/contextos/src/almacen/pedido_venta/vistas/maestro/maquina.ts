import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroPedidoVenta, EstadoMaestroPedidoVenta } from "./diseño.ts";
import * as maestro from "./maestro.js";

export const getMaquina: () => Maquina<EstadoMaestroPedidoVenta, ContextoMaestroPedidoVenta> = () => {
    return {
        INICIAL: {
            pedido_seleccionado: [maestro.Pedidos.activar],
            pedido_deseleccionado: [maestro.Pedidos.desactivar],

            recarga_de_pedidos_solicitada: maestro.recargarPedidos,

            criteria_cambiado: [maestro.Pedidos.filtrar, maestro.recargarPedidos],

            siguiente_pagina: [maestro.Pedidos.filtrar, maestro.ampliarPedidos],

            seleccionadas_cambiadas: async (ctx, payload) => ({ ...ctx, seleccionadas: payload as string[] }),

            generar_salida_solicitada: "GENERANDO_SALIDA",

            comprobar_reservas_solicitado: "COMPROBANDO_RESERVAS",
        },

        GENERANDO_SALIDA: {
            salida_cancelada: "INICIAL",
            salida_generada: async (ctx) => ({ ...ctx, estado: "INICIAL" as EstadoMaestroPedidoVenta, seleccionadas: [] }),
        },

        COMPROBANDO_RESERVAS: {
            reservas_comprobadas: [maestro.actualizarDisponibilidades],
            comprobar_reservas_cancelado: "INICIAL",
        },
    };
};
