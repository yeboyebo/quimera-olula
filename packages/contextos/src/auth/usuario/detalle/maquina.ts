import { Maquina } from "@olula/lib/diseño.js";
import { ContextoDetalleUsuario, EstadoDetalleUsuario } from "./diseño.ts";
import {
    cancelarEdicion,
    cargarUsuario,
    guardarUsuario,
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoDetalleUsuario, ContextoDetalleUsuario> = () => {
    return {
        INICIAL: {
            cargar: [cargarUsuario],
        },

        LISTO: {
            edicion_de_usuario_lista: [guardarUsuario, "GUARDANDO"],
            edicion_de_usuario_cancelada: cancelarEdicion,
        },

        GUARDANDO: {
            usuario_guardado: "LISTO",
        },
    };
};
