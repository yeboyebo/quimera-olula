import { Entidad } from "../../comun/diseño.ts";

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
    responsable_id: string | null;
    prioridad: PrioridadIncidencia;
}

export type NuevaIncidencia = {
    descripcion: string;
    descripcion_larga: string;
    nombre: string;
    responsable_id: string | null;
    prioridad: PrioridadIncidencia;
    fecha: Date;
};

