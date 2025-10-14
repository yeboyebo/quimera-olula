import { Pedido } from "#/ventas/pedido/diseño.ts";
import { payloadPatchPedido } from "#/ventas/pedido/infraestructura_base.ts";

type PedidoAPI = Pedido

export const pedidoDesdeAPI = (p: PedidoAPI): Pedido => p;

export const payloadPatchPedidoGUA = (pedido: Pedido) => {
    const payloadBase = payloadPatchPedido(pedido);
    const payload = {
        ...payloadBase,
        cambios: {
            ...payloadBase.cambios,
            feria_id: pedido.feria_id,
        },
    };

    return payload;
}