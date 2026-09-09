import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroIaTareaProgramada, EstadoMaestroIaTareaProgramada } from "./diseño.js";
import * as maestro from "./maestro.js";

export const getMaquina: () => Maquina<EstadoMaestroIaTareaProgramada, ContextoMaestroIaTareaProgramada> = () => {
    return {
        INICIAL: {
            tarea_programada_ia_seleccionada: [maestro.Tareas.activar],
            tarea_programada_ia_deseleccionada: [maestro.Tareas.desactivar],

            tarea_programada_ia_cambiada: [maestro.Tareas.cambiar],
            tarea_programada_ia_borrada: [maestro.Tareas.quitar],

            recarga_solicitada: maestro.recargarTareas,

            criteria_cambiado: [maestro.Tareas.filtrar, maestro.recargarTareas],
            siguiente_pagina: [maestro.Tareas.filtrar, maestro.ampliarTareas],

            creacion_solicitada: "CREANDO",
        },

        CREANDO: {
            alta_cancelada: "INICIAL",
            tarea_programada_ia_creada: maestro.incluirTareaCreadaPorId,
        },
    };
};
