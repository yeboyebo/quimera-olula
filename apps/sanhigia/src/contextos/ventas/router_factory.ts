import { RouterFactoryVentasOlula } from "#/ventas/router_factory.ts";
import { MaestroConDetalleDevolucionesPedidos } from "./devoluciones/maestro/MaestroConDetalleDevolucionesPedidos.tsx";
import { MaestroConDetalleLicenciaFarma } from "./licencia_farma/vistas/MaestroConDetalleLicenciaFarma.tsx";

export class RouterFactoryVentasSanhigia {
    static router = {
        ...RouterFactoryVentasOlula.router,
        "ss/licencias": MaestroConDetalleLicenciaFarma,
        "ventas/devoluciones": MaestroConDetalleDevolucionesPedidos,
    };
}
