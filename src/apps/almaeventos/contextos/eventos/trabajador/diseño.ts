import { Entidad } from "../../../../../contextos/comun/diseño.ts";

export interface Trabajador extends Entidad {
    id: string;
    nombre: string;
    coste: number;
};

export type NuevoTrabajador = {
    id: string;
    nombre: string;
    coste: number;
};