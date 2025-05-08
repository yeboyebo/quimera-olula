// import factoryGuanabana from "./presupuesto/vistas/TabDatos.tsx";

import { metaPedido } from "./pedido/dominio.ts";
// import { payloadPatchPedido } from "./pedido/infraestructura.ts";
import { payloadPatchPedido, pedidoDesdeAPI } from "./pedido/infraestructura_base.ts";
import { TabDatosBase as PedidoTabDatosBase } from "./pedido/vistas/DetallePedido/TabDatos.tsx";
import { metaTablaPedido } from "./pedido/vistas/metatabla_pedido.ts";
import { TabDatosBase as PresupuestoTabDatosBase } from "./presupuesto/vistas/TabDatosBase.tsx";

export class FactoryVentasBase {
    static PresupuestoTabDatos = PresupuestoTabDatosBase
    static PedidoTabDatos = PedidoTabDatosBase
    static pedidoDesdeAPI = pedidoDesdeAPI
    static metaTablaPedido = metaTablaPedido
    static api_payloadPatchPedido = payloadPatchPedido
    static metaPedido = metaPedido
    // static PresupuestoTabDatos = TabDatosGua
}

