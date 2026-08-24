import { MaestroConDetallePedido } from "./pedido/maestro/MaestroConDetallePedido.tsx";
import { MaestroConDetalleProveedor } from "./proveedor/maestro/MaestroConDetalleProveedor.tsx";

export class RouterFactoryComprasOlula {
    static router = {
        "compras/pedido": MaestroConDetallePedido,
        "compras/proveedor": MaestroConDetalleProveedor,
    };
}
