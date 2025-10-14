import { Pedido } from "./diseño.ts";

type PedidoAPI = Pedido

export const pedidoDesdeAPI = (p: PedidoAPI): Pedido => p;

export const payloadPatchPedido = (pedido: Pedido) => {
    const payload = {
        cambios: {
            agente_id: pedido.agente_id,
            divisa: {
                divisa_id: pedido.divisa_id,
                tasa_conversion: pedido.tasa_conversion,
            },
            fecha: pedido.fecha,
            cliente_id: pedido.cliente_id,
            nombre_cliente: pedido.nombre_cliente,
            id_fiscal: pedido.id_fiscal,
            direccion_id: pedido.direccion_id,
            forma_pago_id: pedido.forma_pago_id,
            grupo_iva_negocio_id: pedido.grupo_iva_negocio_id,
            observaciones: pedido.observaciones,
        },
    };

    return payload;
}