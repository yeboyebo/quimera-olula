import { ProcesarContexto } from "@olula/lib/diseño.js";
import { Usuario } from "../diseño.ts";
import { deleteUsuario, getUsuario, patchUsuario } from "../infraestructura.ts";
import { ContextoDetalleUsuario, EstadoDetalleUsuario } from "./diseño.ts";

type ProcesarDetalleUsuario = ProcesarContexto<EstadoDetalleUsuario, ContextoDetalleUsuario>;

export const contextoVacio: ContextoDetalleUsuario = {
    estado: "INICIAL",
    usuario: null,
    usuarioInicial: null,
};

export const cargarUsuario: ProcesarDetalleUsuario = async (contexto, usuarioId) => {
    const usuarioIdStr = usuarioId as string;
    const usuario = await getUsuario(usuarioIdStr);

    return {
        ...contexto,
        usuario,
        usuarioInicial: usuario,
        estado: "LISTO",
    };
};

export const guardarUsuario: ProcesarDetalleUsuario = async (contexto, payload) => {
    const usuarioEditado = payload as Usuario;
    if (!usuarioEditado) return contexto;

    await patchUsuario(usuarioEditado.id, usuarioEditado);
    const usuarioActualizado = await getUsuario(usuarioEditado.id);

    return {
        ...contexto,
        usuario: usuarioActualizado,
        usuarioInicial: usuarioActualizado,
        estado: "LISTO",
    };
};

export const cancelarEdicion: ProcesarDetalleUsuario = async (contexto) => {
    return {
        ...contexto,
        usuario: contexto.usuarioInicial,
    };
};

export const borrarUsuario: ProcesarDetalleUsuario = async (contexto) => {
    if (!contexto.usuario) return contexto;
    await deleteUsuario(contexto.usuario.id);
    return [
        contextoVacio,
        [["usuario_borrado", contexto.usuario]]
    ];
};
