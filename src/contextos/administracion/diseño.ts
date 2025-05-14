import { Entidad } from "../comun/diseño.ts";

export interface Grupo extends Entidad {
    id: string;
    descripcion: string;
}

export interface Regla extends Entidad {
    id: string;
    descripcion: string;
    grupo: string;
}
