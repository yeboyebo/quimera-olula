import { Presupuesto } from "./diseño.ts";

/**
 * Un presupuesto queda bloqueado a cambios solo cuando se ha pedido entero.
 *
 * No es un campo: se deriva de `estado_aprobado`, que es lo único que guarda el
 * servidor. Misma regla que en el backend.
 */
export const aprobado = (presupuesto: Presupuesto): boolean =>
    presupuesto.estado_aprobado === "TOTAL";
