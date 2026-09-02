import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroCredencialExterna, EstadoMaestroCredencialExterna } from "./diseño.js";
import * as maestro from "./maestro.js";

export const getMaquina: () => Maquina<EstadoMaestroCredencialExterna, ContextoMaestroCredencialExterna> = () => {
    return {
        INICIAL: {
            credencial_externa_seleccionada: [maestro.Credenciales.activar],
            credencial_externa_deseleccionada: [maestro.Credenciales.desactivar],

            credencial_externa_cambiada: [maestro.Credenciales.cambiar],
            credencial_externa_borrada: [maestro.Credenciales.quitar],

            recarga_solicitada: maestro.recargarCredenciales,

            criteria_cambiado: [maestro.Credenciales.filtrar, maestro.recargarCredenciales],
            siguiente_pagina: [maestro.Credenciales.filtrar, maestro.ampliarCredenciales],

            creacion_solicitada: maestro.iniciarCreacion,
        },

        CREANDO: {
            alta_cancelada: "INICIAL",
            credencial_externa_creada: maestro.incluirCredencialCreadaPorId,
        },
    };
};
