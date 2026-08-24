import { ListaEntidades } from "@olula/lib/ListaEntidades.ts";
import { LineaPedido, Pedido } from "../diseño.ts";

export type EstadoDetallePedido =
    | 'INICIAL'
    | 'ABIERTO'
    | 'BORRANDO'
    | 'CREANDO_LINEA'
    | 'CAMBIANDO_LINEA'
    | 'BORRANDO_LINEA';

export type ContextoDetallePedido = {
    estado: EstadoDetallePedido;
    pedido: Pedido;
    lineas: ListaEntidades<LineaPedido>;
};
