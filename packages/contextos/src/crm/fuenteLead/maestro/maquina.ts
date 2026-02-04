import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroFuentesLead, EstadoMaestroFuentesLead } from "./diseño.ts";
import { FuentesLead, recargarFuentesLead } from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroFuentesLead, ContextoMaestroFuentesLead> = () => {
    return {
        INICIAL: {
            fuente_lead_cambiada: [FuentesLead.cambiar],

            fuente_lead_seleccionada: [FuentesLead.activar],

            fuente_lead_deseleccionada: [FuentesLead.desactivar],

            fuente_lead_borrada: [FuentesLead.quitar],

            recarga_de_fuentes_lead_solicitada: recargarFuentesLead,

            creacion_de_fuente_lead_solicitada: "CREANDO",
        },
        CREANDO: {
            creacion_fuente_lead_cancelada: "INICIAL",

            fuente_lead_creada: [FuentesLead.incluir, FuentesLead.activar, "INICIAL"],
        }
    }
}
