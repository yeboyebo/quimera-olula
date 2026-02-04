import { Contexto } from "@olula/lib/diseño.js";
import { Usuario } from "../diseño.ts";

export type EstadoDetalleUsuario = "INICIAL" | "LISTO" | "GUARDANDO";

export type ContextoDetalleUsuario = Contexto<EstadoDetalleUsuario> & {
    usuario: Usuario | null;
    usuarioInicial: Usuario | null;
};
