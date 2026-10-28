import { MaestroConDetalleAsiento } from "./asiento/vistas/maestro/MaestroConDetalleAsiento.tsx";
import { InformeDiario } from "./informe/vistas/diario/InformeDiario.tsx";
import { InformeLibroFacturasEmitidas } from "./informe/vistas/libro_facturas_iva/InformeLibroFacturasEmitidas.tsx";
import { InformeLibroFacturasRecibidas } from "./informe/vistas/libro_facturas_iva/InformeLibroFacturasRecibidas.tsx";
import { InformeMayor } from "./informe/vistas/mayor/InformeMayor.tsx";
import { PantallaPgc } from "./pgc/Pgc.tsx";

export class RouterFactoryContabilidadOlula {
    static router = {
        "contabilidad/asiento": MaestroConDetalleAsiento,
        "contabilidad/pgc": PantallaPgc,
        "contabilidad/informe/mayor": InformeMayor,
        "contabilidad/informe/diario": InformeDiario,
        "contabilidad/informe/libro_facturas_emitidas": InformeLibroFacturasEmitidas,
        "contabilidad/informe/libro_facturas_recibidas": InformeLibroFacturasRecibidas,
    };
}
