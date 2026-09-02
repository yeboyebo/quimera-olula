import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { alternarActivoIaTareaProgramada, cargarContexto, refrescarIaTareaProgramada } from "./detalle.js";
import { ContextoDetalleIaTareaProgramada, EstadoDetalleIaTareaProgramada } from "./diseño.js";

export const getMaquina: () => Maquina<EstadoDetalleIaTareaProgramada, ContextoDetalleIaTareaProgramada> = () => {
    return {
        INICIAL: {
            id_cambiado: [cargarContexto],

            tarea_programada_ia_deseleccionada: [
                publicar('tarea_programada_ia_deseleccionada', null),
            ],
        },

        ABIERTO: {
            tarea_programada_ia_guardada: [refrescarIaTareaProgramada],

            borrado_solicitado: "BORRANDO",

            activo_alternado_solicitado: [alternarActivoIaTareaProgramada],

            id_cambiado: [cargarContexto],
        },

        BORRANDO: {
            tarea_programada_ia_borrada: [
                publicar('tarea_programada_ia_borrada', null),
                "INICIAL",
            ],

            borrado_cancelado: "ABIERTO",
        },
    };
};
