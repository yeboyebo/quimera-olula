import { Entidad } from "@olula/lib/diseño.ts";

export interface Empresa extends Entidad {
    id: string;
    nombre: string;
}

export type NuevaEmpresa = {
    nombre: string;
};