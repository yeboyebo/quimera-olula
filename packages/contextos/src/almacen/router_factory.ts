import { MaestroAlmacen } from "./almacen/vistas/maestro/MaestroAlmacen.tsx"
import { MaestroConDetalleArticulo } from "./articulo/maestro/MaestroConDetalleArticulo.tsx"
import { MaestroConDetalleCaja } from "./caja/maestro/MaestroConDetalleCaja.tsx"
import { MaestroFamilia } from "./familia/vistas/maestro/MaestroFamilia.tsx"
import { MaestroConDetalleStock } from "./stock/maestro/MaestroConDetalleStock.tsx"
import { MaestroDetalleTransferenciasStock } from "./transferencias/vistas/MaestroDetalleTransferenciasStock.tsx"

export class RouterFactoryAlmacenOlula {
        static router = {
                "almacen/transferencias": MaestroDetalleTransferenciasStock,
                "almacen/articulo": MaestroConDetalleArticulo,
                "almacen/cajas": MaestroConDetalleCaja,
                "almacen/almacenes": MaestroAlmacen,
                "almacen/familias": MaestroFamilia,
                "almacen/stock": MaestroConDetalleStock,
        }
}
