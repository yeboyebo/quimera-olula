import { MaestroAcciones } from "./accion/maestro/MaestroAcciones.tsx"
import { MaestroClientes } from "./cliente/maestro/MaestroClientes.tsx"
import { MaestroContactos } from "./contacto/maestro/MaestroContactos.tsx"
import { MaestroEstadosLead } from "./estadoLead/maestro/MaestroEstadosLead.tsx"
import { MaestroEstadosOportunidad } from "./estadoOportunidadVenta/maestro/MaestroEstadosOportunidad.tsx"
import { MaestroFuentesLead } from "./fuenteLead/maestro/MaestroFuentesLead.tsx"
import { MaestroIncidencias } from "./incidencia/maestro/MaestroIncidencias.tsx"
import { MaestroLeads } from "./lead/maestro/MaestroLeads.tsx"
import { MaestroOportunidades } from "./oportunidadventa/maestro/MaestroOportunidadesVentas.tsx"

export class RouterFactoryCrmOlula {
    static router = {
        "crm/oportunidadventa": MaestroOportunidades,
        "crm/estadooportunidadventa": MaestroEstadosOportunidad,
        "crm/cliente": MaestroClientes,
        "crm/contacto": MaestroContactos,
        "crm/accion": MaestroAcciones,
        "crm/lead": MaestroLeads,
        "crm/incidencia": MaestroIncidencias,
        "crm/estadolead": MaestroEstadosLead,
        "crm/fuentelead": MaestroFuentesLead,
    }
}
