import { CalendarioEventos } from "./calendario_eventos/vistas/CalendarioEventos.tsx"
import { DetalleEvento } from "./evento/vistas/DetalleEvento/DetalleEvento.tsx"
import { MaestroEvento } from "./evento/vistas/MaestroEvento.tsx"
import { MaestroConDetalleProducto } from "./producto/vistas/MaestroConDetalleProducto.tsx"
import { MaestroConDetalleTrabajador } from "./trabajador/vistas/MaestroConDetalleTrabajador.tsx"
import { MaestroConDetalleTrabajadorEvento } from "./trabajador_evento/vistas/MaestroConDetalleTrabajadorEvento.tsx"

export class RouterFactoryEventosAlma {
    static router = {
        "eventos/calendario": CalendarioEventos,
        "eventos/eventos": MaestroEvento,
        "eventos/evento/:id": DetalleEvento,
        "eventos/producto": MaestroConDetalleProducto,
        "eventos/trabajador": MaestroConDetalleTrabajador,
        "eventos/trabajador_evento": MaestroConDetalleTrabajadorEvento,
    }
}
