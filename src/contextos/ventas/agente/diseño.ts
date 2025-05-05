import { Entidad } from "../../comun/diseño.ts";

export interface Agente extends Entidad {
    id: string;
    nombre: string;
};