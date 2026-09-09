import { ModeloNuevaLinea } from "../../venta/diseño.ts";
import { metaNuevaLinea as metaNuevaLineaBase, nuevaLineaInicial as nuevaLineaInicialBase } from "../../venta/dominio.ts";

export const nuevaLineaInicial: ModeloNuevaLinea = {
    ...nuevaLineaInicialBase,
};

export const metaNuevaLinea = metaNuevaLineaBase;

/**
 * Guarda la línea en el servidor (dryRun=false).
 * Las llamadas con dryRun=true van directamente desde CrearLinea.tsx.
 */
// export const postModelo = async (pedidoId: string, linea: ModeloNuevaLinea): Promise<NuevaLineaPedido> => {
//     return await postLinea(pedidoId, altaLineaDesdeModelo(linea));
// };

/**
 * Campos de ModeloNuevaLinea que, al cambiar, desencadenan una recalculación
 * en el servidor vía getCambiosLineaPedido.
 * Añadir aquí cualquier campo futuro que deba disparar la llamada.
 */
export const camposConCambiosServidor = ['idArticulo', 'cantidad', 'pvpUnitario', 'dtoPorcentual', 'dtoLineal', 'tipoIrpf', 'idGrupoIvaProducto'] as const satisfies readonly (keyof ModeloNuevaLinea)[];
