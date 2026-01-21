import { FactoryVentasOlula } from "#/ventas/factory.ts";
import { TabDatosBase as PresupuestoTabDatos } from "#/ventas/presupuesto/detalle/TabDatosBase.tsx";
import { metaPedidoGUA } from "./pedido/dominio.ts";
import { payloadPatchPedidoGUA } from "./pedido/infraestructura.ts";
import { metaTablaPedidoGUA } from "./pedido/vistas/metatabla_pedido.ts";
import { TabDatosGua } from "./pedido/vistas/TabDatosGua.tsx";

export class FactoryVentasGUA extends FactoryVentasOlula {
    static PresupuestoTabDatos = PresupuestoTabDatos
    static PedidoTabDatos = TabDatosGua
    static api_payloadPatchPedido = payloadPatchPedidoGUA
    static metaPedido = metaPedidoGUA
    static metaTablaPedido = metaTablaPedidoGUA
}