import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { cambiarLead, cargarContexto, getContextoVacio } from "./detalle.ts";
import { ContextoDetalleLead, EstadoDetalleLead } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleLead, ContextoDetalleLead> = () => {
    return {
        INICIAL: {
            lead_id_cambiado: cargarContexto,

            lead_cambiado: cambiarLead,

            edicion_lead_cancelada: [getContextoVacio, publicar("lead_deseleccionado", null)],

            borrado_lead_solicitado: "BORRANDO",
        },
        BORRANDO: {
            borrado_lead_cancelado: "INICIAL",

            lead_borrado: [getContextoVacio, publicar('lead_borrado', (_, leadId) => leadId)],
        }
    }
}
