import { Entidad } from "../../comun/diseño.ts";

export interface Empresa extends Entidad {
    id: string;
    nombre: string;
}

export type NuevaEmpresa = {
    nombre: string;
};