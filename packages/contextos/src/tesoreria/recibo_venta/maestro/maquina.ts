import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroReciboVenta, EstadoMaestroReciboVenta } from "./diseño.js";
import * as maestro from "./maestro.js";

export const getMaquina: () => Maquina<EstadoMaestroReciboVenta, ContextoMaestroReciboVenta> = () => {
    return {
        INICIAL: {
            recibo_seleccionado: [maestro.Recibos.activar],
            recibo_deseleccionado: [maestro.Recibos.desactivar],

            recibo_cambiado: [maestro.Recibos.cambiar],

            recibo_desagrupado: [maestro.Recibos.desactivar, maestro.recargarRecibosActual],

            recarga_de_recibos_solicitada: maestro.recargarRecibos,

            criteria_cambiado: [maestro.Recibos.filtrar, maestro.recargarRecibos],

            siguiente_pagina: [maestro.Recibos.filtrar, maestro.ampliarRecibos],

            seleccionados_cambiados: maestro.seleccionadosCambiados,
            agrupado_solicitado: "AGRUPANDO",
        },

        AGRUPANDO: {
            agrupado_confirmado: maestro.agruparSeleccionados,
            agrupado_cancelado: "INICIAL",
        },
    };
};
