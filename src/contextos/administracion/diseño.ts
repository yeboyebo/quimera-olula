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

export interface Permiso extends Entidad {
    id: string;
    id_regla: string;
    id_grupo: string;
    valor: boolean | null;
}
