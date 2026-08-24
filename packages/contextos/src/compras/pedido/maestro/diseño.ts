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
    /** El albarán generado en el último albaranado, para poder navegar a él. */
    albaranCreado: AlbaranCreado | null;
};
