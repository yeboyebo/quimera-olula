import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroIncidencias, EstadoMaestroIncidencias } from "./diseño.ts";
import { activarIncidencia, cambiarIncidenciaEnLista, desactivarIncidenciaActiva, incluirIncidenciaEnLista, quitarIncidenciaDeLista, recargarIncidencias } from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroIncidencias, ContextoMaestroIncidencias> = () => {
    return {
        INICIAL: {
            incidencia_cambiada: cambiarIncidenciaEnLista,

            incidencia_seleccionada: activarIncidencia,

            incidencia_deseleccionada: desactivarIncidenciaActiva,

            incidencia_borrada: quitarIncidenciaDeLista,

            recarga_de_incidencias_solicitada: recargarIncidencias,

            creacion_de_incidencia_solicitada: "CREANDO",
        },
        CREANDO: {
            creacion_incidencia_cancelada: "INICIAL",

            incidencia_creada: [incluirIncidenciaEnLista, activarIncidencia, "INICIAL"],
        }
    }
}
