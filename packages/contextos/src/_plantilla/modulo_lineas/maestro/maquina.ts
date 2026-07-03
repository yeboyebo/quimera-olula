import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroModLin, EstadoMaestroModLin } from "./diseño.js";
import * as dominio from "./dominio.js";

export const getMaquina: () => Maquina<EstadoMaestroModLin, ContextoMaestroModLin> = () => {
    return {
        INICIAL: {
            modulo_seleccionado: [dominio.ModLins.activar],
            modulo_deseleccionado: [dominio.ModLins.desactivar],
            modulo_cambiado: [dominio.ModLins.cambiar],
            modulo_borrado: [dominio.ModLins.quitar],
            modulo_creado: [dominio.ModLins.incluir],
            recarga_de_modulos_solicitada: dominio.recargarModLins,
            criteria_cambiado: [dominio.ModLins.filtrar, dominio.recargarModLins],
            siguiente_pagina: [dominio.ModLins.filtrar, dominio.ampliarModLins],
            crear_modulo_solicitado: dominio.crearModLinProceso,
        },
    };
};
