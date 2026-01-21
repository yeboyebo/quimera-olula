import { menuVentas } from "./menu.ts";
import { TabDatosBase as PedidoTabDatosBase } from "./pedido/detalle/TabDatos.tsx";
import { metaPedido } from "./pedido/dominio.ts";
import { payloadPatchPedido, pedidoDesdeAPI } from "./pedido/infraestructura_base.ts";
import { metaTablaPedido } from "./pedido/maestro/metatabla_pedido.ts";

export class FactoryVentasOlula {
    static PedidoTabDatos = PedidoTabDatosBase
    static pedidoDesdeAPI = pedidoDesdeAPI
    static metaTablaPedido = metaTablaPedido
    static api_payloadPatchPedido = payloadPatchPedido
    static metaPedido = metaPedido
    static menu = menuVentas
}
