import { ModeloNuevaLinea } from "../../venta/diseño.ts";
import { metaNuevaLinea, nuevaLineaInicial } from "../../venta/dominio.ts";

export { metaNuevaLinea, nuevaLineaInicial };

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
export const camposConCambiosServidor = ['idArticulo', 'cantidad', 'pvpUnitario'] as const satisfies readonly (keyof ModeloNuevaLinea)[];

/**
 * Adapter: convierte ModeloNuevaLinea + contexto de pedido → llamada a
 * getCambiosLineaPedido, y devuelve solo los campos de ModeloNuevaLinea afectados.
 *
 * El contexto aporta pedidoId para que el servidor pueda resolver la tarifa
 * del cliente, el almacén, etc.
 */
// export const getCambiosNuevaLinea = async (
//     modelo: ModeloNuevaLinea,
//     campo: string,
//     contexto: ContextoCambiosLineaPedido
// ): Promise<Partial<ModeloNuevaLinea>> => {
//     // Sin referencia no hay nada que calcular
//     if (!modelo.idArticulo) return {};

//     const lineaParaServidor: LineaPedido = {
//         id: '',
//         referencia: modelo.idArticulo,
//         descripcion: modelo.descripcion ?? '',
//         descripcionArticulo: modelo.descripcionArticulo,
//         cantidad: modelo.cantidad,
//         pvp_unitario: modelo.pvpUnitario ?? 0,
//         dto_porcentual: 0,
//         dto_lineal: 0,
//         pvp_total: modelo.pvpTotal ?? 0,
//         iva_incluido: false,
//         grupo_iva_producto_id: '',
//         tipo_irpf: 0,
//         tipo_recargo: 0,
//         tipo_iva: 0,
//         por_comision: 0,
//         importe_comision: 0,
//     };

//     const lineaActualizada = await getCambiosLineaPedido(lineaParaServidor, campo, contexto);

//     // Devolver solo los campos relevantes para ModeloNuevaLinea.
//     // Ampliar cuando el servidor devuelva más campos a propagar al formulario.
//     return {
//         descripcion: lineaActualizada.descripcion,
//         pvp_unitario: lineaActualizada.pvpUnitario,
//         pvp_total: lineaActualizada.pvpTotal,
//     };
// };
