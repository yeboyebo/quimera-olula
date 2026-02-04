import { Contexto } from "@olula/lib/diseño.js";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Usuario } from "../diseño.ts";

export type EstadoMaestroUsuario = "INICIAL" | "LISTO" | "CARGANDO";

export type ContextoMaestroUsuario = Contexto<EstadoMaestroUsuario> & {
    usuarios: ListaEntidades<Usuario>;
};
