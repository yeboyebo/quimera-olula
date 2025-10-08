import { MaestroConDetalleAccion } from "./accion/vistas/MaestroConDetalleAccion.tsx"
import { MaestroConDetalleClienteCRM } from "./cliente/vistas/MaestroConDetalleCliente.tsx"
import { MaestroConDetalleContacto } from "./contacto/vistas/MaestroConDetalleContacto.tsx"
import { MaestroConDetalleEstadoOportunidad } from "./estadoOportunidadVenta/vistas/MaestroConDetalleEstadoOportunidad.tsx"
import { MaestroConDetalleIncidencia } from "./incidencia/vistas/MaestroConDetalleIncidencia.tsx"
import { MaestroConDetalleLead } from "./lead/vistas/MaestroConDetalleLead.tsx"
import { MaestroConDetalleOportunidadVenta } from "./oportunidadventa/vistas/MaestroConDetalleOportunidadVenta.tsx"

export class RouterFactoryCrmOlula {
    static router = {
        "crm/oportunidadventa": MaestroConDetalleOportunidadVenta,
        "crm/estadooportunidadventa": MaestroConDetalleEstadoOportunidad,
        "crm/cliente": MaestroConDetalleClienteCRM,
        "crm/contacto": MaestroConDetalleContacto,
        "crm/accion": MaestroConDetalleAccion,
        "crm/lead": MaestroConDetalleLead,
        "crm/incidencia": MaestroConDetalleIncidencia,
    }
}
