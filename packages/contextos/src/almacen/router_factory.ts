import { MaestroConDetalleAlmacen } from "./almacen/vistas/MaestroConDetalleAlmacen.tsx"
import { MaestroDetalleTransferenciasStock } from "./transferencias/vistas/MaestroDetalleTransferenciasStock.tsx"

export class RouterFactoryAlmacenOlula {
    static router = {
        "almacen/transferencias": MaestroDetalleTransferenciasStock,
        "almacen/almacenes": MaestroConDetalleAlmacen,
    }
}
