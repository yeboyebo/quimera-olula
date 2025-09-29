import { Entidad, Filtro, Orden, Paginacion, RespuestaLista2 } from "../../comun/diseño.ts";

export interface Usuario extends Entidad {
  id: string;
  nombre: string;
  grupo_id: string;
};

export interface UsuarioApi {
  id: string;
  nombre: string;
  grupo_id: string;
};


export type GetUsuarios = (f: Filtro, o: Orden, p?: Paginacion) => Promise<RespuestaLista2<Usuario>>;

export interface UsuarioAPI extends Entidad {
  id: string;
  nombre: string;
  grupo_id: string;
}

export type GetUsuario = (id: string) => Promise<Usuario>;


export type PostUsuario = (usuario: Partial<Usuario>) => Promise<string>;
export type PatchUsuario = (id: string, usuario: Partial<Usuario>) => Promise<void>;
export type DeleteUsuario = (id: string) => Promise<void>;
