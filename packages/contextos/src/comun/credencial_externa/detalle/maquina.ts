import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { alternarActivoCredencialExterna, cargarContexto, refrescarCredencialExterna } from "./detalle.js";
import { ContextoDetalleCredencialExterna, EstadoDetalleCredencialExterna } from "./diseño.js";

export const getMaquina: () => Maquina<EstadoDetalleCredencialExterna, ContextoDetalleCredencialExterna> = () => {
    return {
        INICIAL: {
            id_cambiado: [cargarContexto],

            credencial_externa_deseleccionada: [
                publicar('credencial_externa_deseleccionada', null),
            ],
        },

        ABIERTO: {
            credencial_externa_guardada: [refrescarCredencialExterna],

            borrado_solicitado: "BORRANDO",
            rotacion_solicitada: "ROTANDO",

            activo_alternado_solicitado: [alternarActivoCredencialExterna],

            id_cambiado: [cargarContexto],
        },

        BORRANDO: {
            credencial_externa_borrada: [
                publicar('credencial_externa_borrada', null),
                "INICIAL",
            ],

            borrado_cancelado: "ABIERTO",
        },

        ROTANDO: {
            credencial_externa_rotada: "ABIERTO",
            rotacion_cancelada: "ABIERTO",
        },
    };
};
