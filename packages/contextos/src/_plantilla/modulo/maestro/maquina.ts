import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroModulo, EstadoMaestroModulo } from "./diseño.js";
import * as dominio from "./dominio.js";

export const getMaquina: () => Maquina<EstadoMaestroModulo, ContextoMaestroModulo> = () => {
    return {
        INICIAL: {
            // Selección de entidades
            modulo_seleccionado: [dominio.Modulos.activar],
            modulo_deseleccionado: [dominio.Modulos.desactivar],

            // Sincronización con detalle
            modulo_cambiado: [dominio.Modulos.cambiar],
            modulo_borrado: [dominio.Modulos.quitar],
            modulo_creado: [dominio.Modulos.incluir],

            // Recarga completa (al montar o cambiar filtros)
            recarga_de_modulos_solicitada: dominio.recargarModulos,

            // Cambio de criteria → actualiza criteria en lista y recarga desde cero
            criteria_cambiado: [dominio.Modulos.filtrar, dominio.recargarModulos],

            // Paginación incremental → actualiza criteria y añade al final de la lista
            siguiente_pagina: [dominio.Modulos.filtrar, dominio.ampliarModulos],

            // Crear entidad directamente (sin estado modal separado)
            crear_modulo_solicitado: dominio.crearModuloProceso,
        },
    };
};
