import { Entidad } from "@olula/lib/diseño.ts";

export interface Grupo extends Entidad {
    id: string;
    nombre: string;
}

export interface Regla extends Entidad {
    id: string;
    descripcion: string;
    grupo: string;
}

export interface ReglaConValor extends Regla {
    valor: boolean | null
}

export interface Permiso extends Entidad {
    id: string;
    id_regla: string;
    id_grupo: string;
    valor: boolean | null;
}

export interface ReglaAnidada extends ReglaConValor {
    hijos?: ReglaAnidada[];
}

export interface CategoriaReglas {
    id: string;
    descripcion: string;
    reglas: ReglaAnidada[];
    valor?: boolean | null;
}