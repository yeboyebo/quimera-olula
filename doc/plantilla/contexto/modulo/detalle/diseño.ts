import { Modulo } from "../diseño.ts";

/**
 * Estados posibles en la vista de detalle.
 *
 * Patrón de estados: el detalle puede tener sub-estados para operaciones
 * que abren modales (BORRANDO, CAMBIANDO_X, etc.).
 * En ese caso el estado principal (ABIERTO) se bifurca según datos de la entidad.
 */
export type EstadoDetalleModulo =
    | 'INICIAL'
    | 'ABIERTO'
    | 'BORRANDO';

/**
 * Contexto del detalle (edición de un módulo)
 *
 * Nota: no se guarda el módulo inicial separado.
 * El auto-guardado de useModelo se encarga de persistir en API al cambiar.
 */
export type ContextoDetalleModulo = {
    estado: EstadoDetalleModulo;
    modulo: Modulo;
};
