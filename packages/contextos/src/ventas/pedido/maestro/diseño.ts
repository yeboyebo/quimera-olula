import { Pedido } from "../diseño.ts";

export type EstadoMaestroPedido = (
    'INICIAL' | 'CREANDO_PEDIDO'
);


export type ContextoMaestroPedido = {
    estado: EstadoMaestroPedido;
    pedidos: Pedido[];
    totalPedidos: number;
    pedidoActivo: Pedido | null;
};
