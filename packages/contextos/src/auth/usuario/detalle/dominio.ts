import { ProcesarContexto } from "@olula/lib/diseño.js";
import { getUsuario, patchUsuario } from "../infraestructura.ts";
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

export const guardarUsuario: ProcesarDetalleUsuario = async (contexto) => {
    if (!contexto.usuario) return contexto;

    await patchUsuario(contexto.usuario.id, contexto.usuario);

    return {
        ...contexto,
        usuarioInicial: contexto.usuario,
        estado: "LISTO",
    };
};

export const cancelarEdicion: ProcesarDetalleUsuario = async (contexto) => {
    return {
        ...contexto,
        usuario: contexto.usuarioInicial,
    };
};
