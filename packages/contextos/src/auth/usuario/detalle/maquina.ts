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
            usuario_id_cambiada: [cargarUsuario],
        },

        LISTO: {
            edicion_de_usuario_lista: [guardarUsuario, "GUARDANDO"],
            edicion_de_usuario_cancelada: cancelarEdicion,
            usuario_id_cambiada: [cargarUsuario],
        },

        GUARDANDO: {
            usuario_guardado: "LISTO",
        },
    };
};
