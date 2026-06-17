import { MaestroConDetalleComunicacion } from "./comunicacion/maestro/MaestroConDetalleComunicacion.tsx";

export class RouterFactoryComunOlula {
    static router = {
        "comun/comunicacion": MaestroConDetalleComunicacion,
        "comun/comunicacion/:id": MaestroConDetalleComunicacion,
    };
}
