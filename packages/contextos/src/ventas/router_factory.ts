import { MaestroConDetalleAlbaran } from "./albaran/vistas/MaestroConDetalleAlbaran.tsx";
import { DetalleAlbaranarPedido } from "./albaranarPedido/vistas/DetalleAlbaranarPedido.tsx";
import { MaestroConDetalleCliente } from "./cliente/vistas/MaestroConDetalleCliente.tsx";
import { MaestroConDetalleFactura } from "./factura/vistas/MaestroConDetalleFactura.tsx";
import { MaestroConDetallePedido } from "./pedido/vistas/MaestroConDetallePedido.tsx";
import { TabDatosBase } from "./presupuesto/vistas/DetallePresupuesto/TabDatosBase.tsx";
import { MaestroConDetallePresupuesto } from "./presupuesto/vistas/MaestroConDetallePresupuesto.tsx";
import { MaestroConDetalleVentaTpv } from "./ventaTpv/vistas/MaestroConDetalleVentaTpv.tsx";

export class RouterFactoryVentasOlula {
    static router = {
        "ventas/cliente": MaestroConDetalleCliente,
        "ventas/presupuesto": () => MaestroConDetallePresupuesto({ TabDatos: TabDatosBase }),
        "ventas/pedido": MaestroConDetallePedido,
        "ventas/albaran": MaestroConDetalleAlbaran,
        "ventas/factura": MaestroConDetalleFactura,
        "ventas/venta-tpv": MaestroConDetalleVentaTpv,
        "ventas/albaranar-pedido/:id": DetalleAlbaranarPedido,
    }
}
