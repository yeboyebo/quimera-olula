import { ModeloNuevaLinea } from "../../venta/diseño.ts";
import { altaLineaDesdeModelo, metaNuevaLinea, nuevaLineaVacia } from "../../venta/dominio.ts";
import { ContextoCambiosLineaPedido, LineaPedido } from "../diseño.ts";
import { getCambiosLineaPedido, postLinea } from "../infraestructura.ts";

export { metaNuevaLinea, nuevaLineaVacia };
export type { ModeloNuevaLinea };

export const postModelo = async (idPedido: string, linea: ModeloNuevaLinea) => {
    await postLinea(idPedido, altaLineaDesdeModelo(linea));
};

/**
 * Campos de ModeloNuevaLinea que, al cambiar, desencadenan una recalculación
 * en el servidor vía getCambiosLineaPedido.
 * Añadir aquí cualquier campo futuro que deba disparar la llamada.
 */
export const camposConCambiosServidor = ['referencia', 'cantidad'] as const satisfies readonly (keyof ModeloNuevaLinea)[];

/**
 * Adapter: convierte ModeloNuevaLinea + contexto de pedido → llamada a
 * getCambiosLineaPedido, y devuelve solo los campos de ModeloNuevaLinea afectados.
 *
 * El contexto aporta pedidoId para que el servidor pueda resolver la tarifa
 * del cliente, el almacén, etc.
 */
export const getCambiosNuevaLinea = async (
    modelo: ModeloNuevaLinea,
    campo: string,
    contexto: ContextoCambiosLineaPedido
): Promise<Partial<ModeloNuevaLinea>> => {
    // Sin referencia no hay nada que calcular
    if (!modelo.referencia) return {};

    const lineaParaServidor: LineaPedido = {
        id: '',
        referencia: modelo.referencia,
        descripcion: modelo.descripcion ?? '',
        descripcionArticulo: modelo.descripcionArticulo,
        cantidad: modelo.cantidad,
        pvp_unitario: modelo.pvp_unitario ?? 0,
        dto_porcentual: 0,
        dto_lineal: 0,
        pvp_total: modelo.pvp_total ?? 0,
        iva_incluido: false,
        grupo_iva_producto_id: '',
        tipo_irpf: 0,
        tipo_recargo: 0,
        tipo_iva: 0,
        por_comision: 0,
        importe_comision: 0,
    };

    const lineaActualizada = await getCambiosLineaPedido(lineaParaServidor, campo, contexto);

    // Devolver solo los campos relevantes para ModeloNuevaLinea.
    // Ampliar cuando el servidor devuelva más campos a propagar al formulario.
    return {
        descripcion: lineaActualizada.descripcion,
        pvp_unitario: lineaActualizada.pvp_unitario,
        pvp_total: lineaActualizada.pvp_total,
    };
};
