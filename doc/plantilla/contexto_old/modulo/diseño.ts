import { Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";

export interface Modulo extends Entidad {
    id: string;
    nombre: string;
    descripcion: string;
    estado: string;
}

export interface ModuloAPI extends Entidad {
    id: string;
    nombre: string;
    descripcion: string;
    estado: string;
}

export type GetModulo = (id: string) => Promise<Modulo>;
export type GetModulos = (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
) => RespuestaLista<Modulo>;

export type PostModulo = (modulo: Partial<Modulo>) => Promise<string>;
export type PatchModulo = (id: string, modulo: Partial<Modulo>) => Promise<void>;
export type DeleteModulo = (id: string) => Promise<void>;
