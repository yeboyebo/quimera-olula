import { Modulo } from "../diseño.ts";

/**
 * Estados posibles en la vista de detalle
 */
export type EstadoDetalleModulo = 'INICIAL' | 'ABIERTO' | 'EDITANDO' | 'GUARDANDO';

/**
 * Contexto del detalle (edición de un módulo)
 */
export type ContextoDetalleModulo = {
    estado: EstadoDetalleModulo;
    modulo: Modulo;
    moduloInicial: Modulo; // Para poder cancelar cambios
};
