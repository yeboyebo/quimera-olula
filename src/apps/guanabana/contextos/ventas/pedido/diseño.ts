import { Pedido } from "../../../../../contextos/ventas/pedido/diseño.ts";

export interface PedidoGUA extends Pedido {
  feria_ui?: string;
}