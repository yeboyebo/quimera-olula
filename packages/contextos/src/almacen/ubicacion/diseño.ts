import { Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";

export interface Ubicacion extends Entidad {
    id: string;
    almacenId: string;
};

export interface UbicacionAPI extends Entidad {
    id: string;
    almacen_id: string;
}

export type GetUbicacion = (id: string) => Promise<Ubicacion>;
export type GetUbicaciones = (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
) => RespuestaLista<Ubicacion>;

export type PostUbicacion = (ubicacion: Partial<Ubicacion>) => Promise<string>;
export type PatchUbicacion = (id: string, ubicacion: Partial<Ubicacion>) => Promise<void>;
export type DeleteUbicacion = (id: string) => Promise<void>;

export type NuevaUbicacion = {
    id: string;
    almacenId: string;
};
