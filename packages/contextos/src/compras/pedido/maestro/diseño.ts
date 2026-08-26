import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { AlbaranCreado } from "../../albaran/diseño.ts";
import { Pedido } from "../diseño.ts";

export type EstadoMaestroPedido =
    | 'INICIAL'
    | 'CREANDO'
    | 'ALBARANANDO'
    | 'ALBARAN_CREADO';

export type ContextoMaestroPedido = {
    estado: EstadoMaestroPedido;
    pedidos: ListaActivaEntidades<Pedido>;
    seleccionados: string[];
    albaranCreado: AlbaranCreado | null;
};
