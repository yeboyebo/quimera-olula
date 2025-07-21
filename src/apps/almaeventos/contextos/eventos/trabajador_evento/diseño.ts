import { Entidad } from "../../../../../contextos/comun/diseño.ts";

export interface TrabajadorEvento extends Entidad {
    id: string;
    nombre: string;
    coste: number;
    evento_id: string
    liquidado: boolean
    trabajador_id: string
};

export type NuevoTrabajadorEvento = {
    id: string;
    nombre: string;
    coste: number;
    evento_id: string
    liquidado: boolean
    trabajador_id: string
};