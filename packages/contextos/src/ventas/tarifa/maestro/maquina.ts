import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroTarifa, EstadoMaestroTarifa } from "./diseño.js";
import * as maestro from "./maestro.js";

export const getMaquina: () => Maquina<EstadoMaestroTarifa, ContextoMaestroTarifa> = () => {
    return {
        INICIAL: {
            // Selección de entidades
            tarifa_seleccionada: [maestro.Tarifas.activar],
            tarifa_deseleccionada: [maestro.Tarifas.desactivar],

            // Sincronización con detalle
            tarifa_cambiada: [maestro.Tarifas.cambiar],
            tarifa_borrada: [maestro.Tarifas.quitar],

            // Recarga completa (al montar o cambiar filtros)
            recarga_de_tarifas_solicitada: maestro.recargarTarifas,

            // Cambio de criteria → actualiza criteria en lista y recarga desde cero
            criteria_cambiado: [maestro.Tarifas.filtrar, maestro.recargarTarifas],

            // Paginación incremental → actualiza criteria y añade al final de la lista
            siguiente_pagina: [maestro.Tarifas.filtrar, maestro.ampliarTarifas],

            // Abrir modal de creación
            crear_tarifa_solicitado: "CREANDO",
        },

        CREANDO: {
            // Cancelar creación → volver al listado
            alta_de_tarifa_cancelada: "INICIAL",

            // Tarifa creada por el modal → obtener entidad e incluir en lista
            tarifa_creada: maestro.incluirTarifaCreadaPorId,
        },
    };
};
