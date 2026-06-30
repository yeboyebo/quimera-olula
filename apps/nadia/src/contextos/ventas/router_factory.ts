import { MaestroConDetalleArticulo } from "#/ventas/articulo/vistas/MaestroConDetalleArticulo.tsx";

export class RouterFactoryVentasNad {
    static router = {
        "ventas/articulo": MaestroConDetalleArticulo,
        "ventas/articulo/:id": MaestroConDetalleArticulo,
    };
}
