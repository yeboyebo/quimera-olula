import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import {
    cargarCandidatos,
    cargarContexto,
    onConciliado,
    onDesconciliado,
    onIgnorado,
    onReactivado,
    seleccionarCandidato,
} from "./detalle.js";
import { ContextoDetalleConciliacion, EstadoDetalleConciliacion } from "./diseño.js";

export const getMaquina: () => Maquina<EstadoDetalleConciliacion, ContextoDetalleConciliacion> = () => {
    return {
        INICIAL: {
            movimiento_id_cambiado: [cargarContexto],

            movimiento_deseleccionado: [
                publicar('movimiento_deseleccionado', null),
            ],
        },

        ABIERTO: {
            movimiento_id_cambiado: [cargarContexto],

            movimiento_deseleccionado: [
                publicar('movimiento_deseleccionado', null),
            ],

            candidatos_buscados: [cargarCandidatos],

            conciliacion_solicitada: [seleccionarCandidato, "CONCILIANDO"],
            ignorar_solicitado: "IGNORANDO",
            desconciliar_solicitado: "DESCONCILIANDO",
            reactivar_solicitado: "REACTIVANDO",
        },

        CONCILIANDO: {
            // onConciliado deja el contexto en 'ABIERTO' (ver refrescarMovimiento).
            conciliacion_confirmada: [onConciliado],
            conciliacion_cancelada: "ABIERTO",
        },

        DESCONCILIANDO: {
            // onDesconciliado decide el estado final: 'ABIERTO' si el movimiento
            // sigue existiendo, 'INICIAL' si el banco lo retiró y se borró.
            desconciliacion_confirmada: [onDesconciliado],
            desconciliacion_cancelada: "ABIERTO",
        },

        IGNORANDO: {
            ignorar_confirmado: [onIgnorado],
            ignorar_cancelado: "ABIERTO",
        },

        REACTIVANDO: {
            reactivacion_confirmada: [onReactivado],
            reactivacion_cancelada: "ABIERTO",
        },
    };
};
