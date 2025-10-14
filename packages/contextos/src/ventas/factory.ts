import { menuVentas } from "./menu.ts";
import { metaPedido } from "./pedido/dominio.ts";
import { payloadPatchPedido, pedidoDesdeAPI } from "./pedido/infraestructura_base.ts";
import { TabDatosBase as PedidoTabDatosBase } from "./pedido/vistas/DetallePedido/TabDatos.tsx";
import { metaTablaPedido } from "./pedido/vistas/metatabla_pedido.ts";

export class FactoryVentasOlula {
    static PedidoTabDatos = PedidoTabDatosBase
    static pedidoDesdeAPI = pedidoDesdeAPI
    static metaTablaPedido = metaTablaPedido
    static api_payloadPatchPedido = payloadPatchPedido
    static metaPedido = metaPedido
    static menu = menuVentas
}
