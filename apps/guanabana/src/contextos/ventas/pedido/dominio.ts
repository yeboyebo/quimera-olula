import { metaPedido } from "#/ventas/pedido/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { PedidoGUA } from "./diseño.ts";

export const metaPedidoGUA: MetaModelo<PedidoGUA> = {
    ...metaPedido,
    campos: {
        ...metaPedido.campos,
        feria_id: { requerido: true },
    },
};