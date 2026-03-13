import { LineaPedido, Pedido } from "../diseño.ts";

export type {
    LineaPedido,
    Pedido
} from "../diseño.ts";

export type EstadoPedido = (
    'INICIAL' | "ABIERTO" | "SERVIDO"
    | "BORRANDO_PEDIDO"
    | "CAMBIANDO_CLIENTE"
    | "CREANDO_LINEA" | "BORRANDO_LINEA" | "CAMBIANDO_LINEA"
);
export type ContextoPedido<TPedido extends Pedido = Pedido> = {
    estado: EstadoPedido,
    pedido: TPedido;
    pedidoInicial: TPedido;
    lineaActiva: LineaPedido | null;
};
