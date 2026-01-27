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
export type ContextoPedido = {
    estado: EstadoPedido,
    pedido: Pedido;
    pedidoInicial: Pedido;
    lineaActiva: LineaPedido | null;
};
