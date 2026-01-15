import { MaestroConDetalleArqueoTpv } from "./arqueo/Maestro/MaestroConDetalleArqueoTpv.tsx";
import { MaestroConDetalleVentaTpv } from "./venta/vistas/MaestroConDetalleVentaTpv.tsx";

export class RouterFactoryTpvOlula {
    static router = {
        "tpv/venta": MaestroConDetalleVentaTpv,
        "tpv/arqueo": MaestroConDetalleArqueoTpv,
    }
}
