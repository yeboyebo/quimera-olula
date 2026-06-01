import { RouterFactoryVentasOlula } from "#/ventas/router_factory.ts";
import { MaestroConDetalleLicenciaFarma } from "./licencia_farma/vistas/MaestroConDetalleLicenciaFarma.tsx";

export class RouterFactoryVentasSanhigia {
    static router = {
        ...RouterFactoryVentasOlula.router,
        "ss/licencias": MaestroConDetalleLicenciaFarma,
    };
}
