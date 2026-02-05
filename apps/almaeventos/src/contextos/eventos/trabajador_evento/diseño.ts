import { Entidad } from "@olula/lib/diseño.ts";

export interface TrabajadorEvento extends Entidad {
    id: string;
    nombre: string;
    coste: number;
    evento_id: string;
    liquidado: boolean;
    trabajador_id: string;
    descripcion: string;
    fecha: Date | null;
};

export type NuevoTrabajadorEvento = {
    id: string;
    nombre: string;
    coste: number;
    evento_id: string;
    liquidado: boolean;
    trabajador_id: string;
    descripcion: string;
    fecha: Date | null;
};