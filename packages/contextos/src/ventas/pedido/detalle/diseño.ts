import { LineaPedido, Pedido } from "../diseño.ts";

export type {
    LineaPedido,
    Pedido
} from "../diseño.ts";

export type EstadoPedido = (
    'INICIAL' | "ABIERTO" | "SERVIDO"
    | "BORRANDO_PEDIDO"
    | "CAMBIANDO_CLIENTE"
    | "CAMBIANDO_DESCUENTO"
    | "CREANDO_LINEA" | "BORRANDO_LINEA" | "CAMBIANDO_LINEA"
);
export type ContextoPedido<T extends Pedido = Pedido> = {
    estado: EstadoPedido,
    pedido: T;
    pedidoInicial: T;
    lineaActiva: LineaPedido | null;
};
