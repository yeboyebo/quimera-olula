import { Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";

export interface Almacen extends Entidad {
    id: string;
    nombre: string;
};

export interface AlmacenAPI extends Entidad {
    id: string;
    nombre: string;
}

export type GetAlmacen = (id: string) => Promise<Almacen>;
export type GetAlmacenes = (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
) => RespuestaLista<Almacen>;

export type PostAlmacen = (modulo: Partial<Almacen>) => Promise<string>;
export type PatchAlmacen = (id: string, modulo: Partial<Almacen>) => Promise<void>;
export type DeleteAlmacen = (id: string) => Promise<void>;

export type NuevoAlmacen = {
    id: string;
    nombre: string;
};
