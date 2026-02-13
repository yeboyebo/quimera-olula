import { LineaPedido } from "#/ventas/pedido/diseño.ts";

export interface LineaPedidoNrj extends LineaPedido {
    idVariedad: string;
}

type NuevaLineaPedidoNrj = {
    cantidad: number;
    idVariedad: string;
};

export type PostLineaNrj = (id: string, linea: NuevaLineaPedidoNrj) => Promise<string>;
