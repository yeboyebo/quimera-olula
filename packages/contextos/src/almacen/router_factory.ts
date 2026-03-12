import { MaestroAlmacen } from "./almacen/vistas/maestro/MaestroAlmacen.tsx"
import { MaestroFamilia } from "./familia/vistas/maestro/MaestroFamilia.tsx"
import { MaestroDetalleTransferenciasStock } from "./transferencias/vistas/MaestroDetalleTransferenciasStock.tsx"

export class RouterFactoryAlmacenOlula {
    static router = {
        "almacen/transferencias": MaestroDetalleTransferenciasStock,
        "almacen/almacenes": MaestroAlmacen,
        "almacen/familias": MaestroFamilia,
    }
}
