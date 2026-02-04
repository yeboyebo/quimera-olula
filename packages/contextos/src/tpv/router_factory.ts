import { MaestroConDetalleArqueoTpv } from "./arqueo/Maestro/MaestroConDetalleArqueoTpv.tsx";
import { MaestroConDetalleVentaTpv } from "./venta/maestro/MaestroConDetalleVentaTpv.tsx";

export class RouterFactoryTpvOlula {
    static router = {
        "tpv/venta": MaestroConDetalleVentaTpv,
        "tpv/arqueo": MaestroConDetalleArqueoTpv,
    }
}
