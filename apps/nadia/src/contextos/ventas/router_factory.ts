import { MaestroConDetalleArticulo } from "#/ventas/articulo/MaestroConDetalleArticulo.tsx";
import { MaestroConDetalleCliente } from "#/ventas/cliente/maestro/MaestroConDetalleCliente.tsx";

export class RouterFactoryVentasNad {
    static router = {
        "ventas/cliente": MaestroConDetalleCliente,
        "ventas/cliente/:id": MaestroConDetalleCliente,
        "ventas/articulo": MaestroConDetalleArticulo,
        "ventas/articulo/:id": MaestroConDetalleArticulo,
    };
}
