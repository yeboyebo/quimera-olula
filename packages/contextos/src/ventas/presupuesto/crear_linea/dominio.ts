import { ModeloNuevaLinea } from "../../venta/diseño.ts";
import { metaNuevaLinea, nuevaLineaInicial } from "../../venta/dominio.ts";

export { metaNuevaLinea, nuevaLineaInicial };
export type { ModeloNuevaLinea };

export const camposConCambiosServidor = ['idArticulo', 'cantidad', 'pvpUnitario'] as const satisfies readonly (keyof ModeloNuevaLinea)[];
