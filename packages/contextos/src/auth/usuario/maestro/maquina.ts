import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroUsuario, EstadoMaestroUsuario } from "./diseño.ts";
import {
    cambiarUsuarioSeleccionado,
    cancelarSeleccion,
    cargarUsuarios,
    recargarUsuarios,
    usuarioBorrado,
    usuarioCambiado,
    usuarioCreado,
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoMaestroUsuario, ContextoMaestroUsuario> = () => {
    return {
        INICIAL: {
            cargar: [cargarUsuarios],
            usuario_seleccionado: cambiarUsuarioSeleccionado,
            recarga_de_usuarios_solicitada: recargarUsuarios,
            creacion_de_usuario_solicitada: 'CREANDO_USUARIO',
        },

        LISTO: {
            usuario_seleccionado: cambiarUsuarioSeleccionado,
            usuario_creado: usuarioCreado,
            usuario_borrado: usuarioBorrado,
            usuario_cambiado: usuarioCambiado,
            seleccion_cancelada: cancelarSeleccion,
            recarga_de_usuarios_solicitada: recargarUsuarios,
            creacion_de_usuario_solicitada: 'CREANDO_USUARIO',
        },

        CREANDO_USUARIO: {
            usuario_creado: [usuarioCreado, 'LISTO'],
            creacion_de_usuario_cancelada: 'LISTO',
        },

        CARGANDO: {},
    };
};
