import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroAcciones, EstadoMaestroAcciones } from "./diseño.ts";
import { activarAccion, cambiarAccionEnLista, desactivarAccionActiva, incluirAccionEnLista, quitarAccionDeLista, recargarAcciones } from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroAcciones, ContextoMaestroAcciones> = () => {
    return {
        INICIAL: {
            accion_cambiada: cambiarAccionEnLista,

            accion_seleccionada: activarAccion,

            accion_deseleccionada: desactivarAccionActiva,

            accion_borrada: quitarAccionDeLista,

            recarga_de_acciones_solicitada: recargarAcciones,

            creacion_de_accion_solicitada: "CREANDO",
        },
        CREANDO: {
            creacion_accion_cancelada: "INICIAL",

            accion_creada: [incluirAccionEnLista, activarAccion, "INICIAL"],
        }
    }
}
