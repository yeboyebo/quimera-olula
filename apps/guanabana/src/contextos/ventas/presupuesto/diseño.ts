import { Pedido } from "#/ventas/pedido/diseño.ts";

export interface PedidoGua extends Pedido {
    feria_id?: string;
}