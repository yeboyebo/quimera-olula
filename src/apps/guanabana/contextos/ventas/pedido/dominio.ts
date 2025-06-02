import { MetaModelo } from "../../../../../contextos/comun/dominio.ts";
import { metaPedido } from "../../../../../contextos/ventas/pedido/dominio.ts";
import { PedidoGUA } from "./diseño.ts";

export const metaPedidoGUA: MetaModelo<PedidoGUA> = {
    ...metaPedido,
    campos: {
        ...metaPedido.campos,
        feria_id: { requerido: true },
    },
};