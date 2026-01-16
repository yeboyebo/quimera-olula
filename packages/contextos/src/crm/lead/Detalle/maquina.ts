import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { cargarContexto, getContextoVacio, onLeadBorrado, refrescarLead } from "./detalle.ts";
import { ContextoDetalleLead, EstadoDetalleLead } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleLead, ContextoDetalleLead> = () => {
    return {
        INICIAL: {
            lead_id_cambiado: cargarContexto,

            lead_cambiado: refrescarLead,

            edicion_lead_cancelada: [getContextoVacio, publicar("lead_deseleccionado", null)],

            borrado_lead_solicitado: "BORRANDO",
        },
        BORRANDO: {
            borrado_lead_cancelado: "INICIAL",

            lead_borrado: onLeadBorrado,
        }
    }
}
