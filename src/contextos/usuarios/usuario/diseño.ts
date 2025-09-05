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

