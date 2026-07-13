import { menuTPV } from "./menu.ts";
import { BotonNuevaVentaBase } from "./venta/maestro/MaestroConDetalleVentaTpv.tsx";

export class FactoryTpvOlula {
    // static PedidoTabDatos = PedidoTabDatosBase
    // static pedidoDesdeAPI = pedidoDesdeAPI
    // static metaTablaPedido = metaTablaPedido
    // static api_payloadPatchPedido = payloadPatchPedido
    // static metaPedido = metaPedido
    static venta_BotonNuevaVenta = BotonNuevaVentaBase
    static menu = menuTPV
}
