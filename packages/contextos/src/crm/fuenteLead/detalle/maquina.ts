import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { cambiarFuenteLead, cargarContexto, getContextoVacio } from "./detalle.ts";
import { ContextoDetalleFuenteLead, EstadoDetalleFuenteLead } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleFuenteLead, ContextoDetalleFuenteLead> = () => {
    return {
        INICIAL: {
            fuente_lead_id_cambiado: cargarContexto,

            fuente_lead_cambiada: cambiarFuenteLead,

            edicion_fuente_lead_cancelada: [getContextoVacio, publicar("fuente_lead_deseleccionada", null)],

            borrado_fuente_lead_solicitado: "BORRANDO",
        },
        BORRANDO: {
            borrado_fuente_lead_cancelado: "INICIAL",

            fuente_lead_borrada: [getContextoVacio, publicar('fuente_lead_borrada', (_, fuenteLeadId) => fuenteLeadId)],
        },
    }
}
