import { Maquina } from "@olula/lib/diseño.js";
import {
    ContextoMaestroComunicacion,
    EstadoMaestroComunicacion,
} from "./diseño.ts";
import {
    ampliarComunicaciones,
    Comunicaciones,
    recargarComunicaciones,
} from "./dominio.ts";

export const getMaquina: () => Maquina<
    EstadoMaestroComunicacion,
    ContextoMaestroComunicacion
> = () => {
    return {
        INICIAL: {
            comunicacion_seleccionada: [Comunicaciones.activar],
            comunicacion_cambiada: Comunicaciones.cambiar,
            comunicacion_deseleccionada: Comunicaciones.desactivar,
            comunicacion_borrada: Comunicaciones.quitar,
            recarga_de_comunicaciones_solicitada: recargarComunicaciones,
            criteria_cambiado: [Comunicaciones.filtrar, recargarComunicaciones],
            siguiente_pagina: [Comunicaciones.filtrar, ampliarComunicaciones],
        },
    };
};
