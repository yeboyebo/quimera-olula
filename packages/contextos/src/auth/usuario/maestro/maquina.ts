import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroUsuario, EstadoMaestroUsuario } from "./diseño.ts";
import {
    cambiarUsuarioSeleccionado,
    cancelarSeleccion,
    cargarUsuarios,
    crearUsuario,
    recargarUsuarios,
    usuarioBorrado,
    usuarioCreado,
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoMaestroUsuario, ContextoMaestroUsuario> = () => {
    return {
        INICIAL: {
            cargar: [cargarUsuarios],
            usuario_seleccionado: cambiarUsuarioSeleccionado,
            recarga_de_usuarios_solicitada: recargarUsuarios,
            creacion_de_usuario_solicitada: crearUsuario,
        },

        LISTO: {
            usuario_seleccionado: cambiarUsuarioSeleccionado,
            usuario_creado: usuarioCreado,
            usuario_borrado: usuarioBorrado,
            seleccion_cancelada: cancelarSeleccion,
            recarga_de_usuarios_solicitada: recargarUsuarios,
            creacion_de_usuario_solicitada: crearUsuario,
        },

        CARGANDO: {},
    };
};
