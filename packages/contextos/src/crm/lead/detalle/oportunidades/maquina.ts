import { Maquina } from "@olula/lib/diseño.js";
import { ContextoOportunidadesLead, EstadoOportunidadesLead } from "./diseño.ts";
import { Oportunidades, recargarOportunidades } from "./oportunidades.ts";

export const getMaquina: () => Maquina<EstadoOportunidadesLead, ContextoOportunidadesLead> = () => {
    return {
        INICIAL: {
            oportunidad_seleccionada: [Oportunidades.activar],

            recarga_de_oportunidades_solicitada: [recargarOportunidades],

            creacion_de_oportunidad_solicitada: "CREANDO",

            borrado_oportunidad_solicitado: "BORRANDO",
        },
        CREANDO: {
            creacion_oportunidad_cancelada: "INICIAL",

            oportunidad_creada: [Oportunidades.incluir, Oportunidades.activar, "INICIAL"],
        },
        BORRANDO: {
            borrado_oportunidad_cancelado: "INICIAL",

            oportunidad_borrada: [Oportunidades.quitar, "INICIAL"],
        }
    }
}
