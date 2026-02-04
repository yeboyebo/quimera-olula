import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoDetalleUsuario, EstadoDetalleUsuario } from "./diseño.ts";
import {
    borrarUsuario,
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
            edicion_de_usuario_lista: [guardarUsuario, publicar("usuario_cambiado", (ctx) => ctx.usuario)],
            edicion_de_usuario_cancelada: cancelarEdicion,
            usuario_id_cambiada: [cargarUsuario],
            usuario_cambiado: "LISTO",
            borrar_solicitado: "BORRANDO",
            generar_token_solicitado: "GENERANDO_TOKEN",
            consultar_token_solicitado: "CONSULTANDO_TOKEN",
        },

        BORRANDO: {
            borrado_confirmado: [borrarUsuario],
            borrado_cancelado: "LISTO",
        },

        GENERANDO_TOKEN: {
            token_generado: "LISTO",
            generacion_cancelada: "LISTO",
        },

        CONSULTANDO_TOKEN: {
            consulta_finalizada: "LISTO",
            consulta_cancelada: "LISTO",
        },
    };
};
