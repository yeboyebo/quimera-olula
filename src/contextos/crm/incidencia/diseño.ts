import { Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "../../comun/diseño.ts";
import { Accion } from "../accion/diseño.ts";

export type PrioridadIncidencia = "alta" | "media" | "baja";

export interface Incidencia extends Entidad {
    id: string;
    descripcion: string;
    descripcion_larga: string;
    nombre: string;
    responsable_id: string | null;
    prioridad: PrioridadIncidencia;
    fecha: Date
}

export interface IncidenciaAPI extends Entidad {
    id: string;
    descripcion: string;
    descripcion_larga: string;
    nombre: string;
    responsable_id: string | null;
    prioridad: PrioridadIncidencia;
    fecha: string; // ISO date string
}

export type NuevaIncidencia = {
    descripcion: string;
    descripcion_larga: string;
    nombre: string;
    responsable_id: string | null;
    prioridad: PrioridadIncidencia;
    fecha: Date;
};


export type GetIncidencia = (id: string) => Promise<Incidencia>;

export type GetIncidencias = (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
) => RespuestaLista<Incidencia>;

export type GetAccionesIncidencia = (id: string) => Promise<Accion[]>;

export type PostIncidencia = (incidencia: Partial<Incidencia>) => Promise<string>;
export type PatchIncidencia = (id: string, incidencia: Partial<Incidencia>) => Promise<void>;
export type DeleteIncidencia = (id: string) => Promise<void>;