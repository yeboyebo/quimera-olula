import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Pedido } from "../diseño.ts";

export type EstadoMaestroPedido = (
    'INICIAL' | 'CREANDO_PEDIDO'
);

export type ContextoMaestroPedido = {
    estado: EstadoMaestroPedido;
    pedidos: ListaActivaEntidades<Pedido>;
};
