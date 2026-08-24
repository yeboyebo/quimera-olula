import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { Pedido } from "../diseño.ts";

export type EstadoMaestroPedido = 'INICIAL' | 'CREANDO';

export type ContextoMaestroPedido = {
    estado: EstadoMaestroPedido;
    pedidos: ListaActivaEntidades<Pedido>;
};
