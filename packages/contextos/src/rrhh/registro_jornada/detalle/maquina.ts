import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoDetalleJornada, EstadoDetalleJornada } from "./diseño.ts";
import {
    cargarContexto,
    determinarEstado,
    getContextoVacio,
    refrescarJornada,
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoDetalleJornada, ContextoDetalleJornada> = () => {
    return {
        INICIAL: {
            id_jornada_cambiado: [cargarContexto],

            jornada_deseleccionada: [
                getContextoVacio,
                publicar('jornada_deseleccionada', null),
            ],
        },

        BORRADOR: {
            jornada_guardada: [refrescarJornada],

            jornada_cambiada: [refrescarJornada],

            aprobar_solicitado: "APROBANDO",

            anular_solicitado: "ANULANDO",

            pausar_solicitado: "PAUSANDO",

            reactivar_solicitado: "REACTIVANDO",
        },

        APROBADA: {
            jornada_cambiada: [refrescarJornada],

            anular_solicitado: "ANULANDO",
        },

        ANULADA: {
            jornada_cambiada: [refrescarJornada],
        },

        APROBANDO: {
            jornada_aprobada: [refrescarJornada, determinarEstado],

            aprobacion_cancelada: "BORRADOR",
        },

        ANULANDO: {
            jornada_anulada: [refrescarJornada, determinarEstado],

            anulacion_cancelada: [determinarEstado],
        },

        PAUSANDO: {
            jornada_pausada: [refrescarJornada, determinarEstado],

            pausa_cancelada: "BORRADOR",
        },

        REACTIVANDO: {
            jornada_reactivada: [refrescarJornada, determinarEstado],

            reactivacion_cancelada: "BORRADOR",
        },
    };
};
