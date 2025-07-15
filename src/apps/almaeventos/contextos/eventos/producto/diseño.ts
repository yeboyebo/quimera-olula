import { Entidad } from "../../../../../contextos/comun/diseño.ts";

export interface Producto extends Entidad {
    id: string;
    descripcion: string;
};

export type NuevoProducto = {
    id: string;
    descripcion: string;
};