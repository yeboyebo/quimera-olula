import { ModeloNuevaLinea } from "#/ventas/venta/diseño.ts";
import { metaNuevaLinea as metaNuevaLineaBase, nuevaLineaInicial as nuevaLineaInicialBase } from "#/ventas/venta/dominio.ts";

export const nuevaLineaInicial: ModeloNuevaLinea = {
    ...nuevaLineaInicialBase,
};

export const metaNuevaLinea = metaNuevaLineaBase;

export const camposConCambiosServidor = ['idArticulo', 'cantidad', 'pvpUnitario', 'dtoPorcentual', 'dtoLineal', 'tipoIrpf', 'idGrupoIvaProducto'] as const satisfies readonly (keyof ModeloNuevaLinea)[];
