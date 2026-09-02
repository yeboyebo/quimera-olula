import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { CategoriaCredencialExterna, CredencialExterna } from "../diseño.js";

export type EstadoMaestroCredencialExterna = 'INICIAL' | 'CREANDO';

export type ContextoMaestroCredencialExterna = {
    estado: EstadoMaestroCredencialExterna;
    credenciales: ListaActivaEntidades<CredencialExterna>;
    /** Qué sección (LLM/Conectores) disparó el alta — ver RejillaCredenciales.tsx. */
    categoriaCreando: CategoriaCredencialExterna;
};
