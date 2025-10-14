import { Entidad } from "@olula/lib/diseño.ts";

export interface Producto extends Entidad {
    id: string;
    descripcion: string;
    codFamilia: string;
}

export type NuevoProducto = {
    id: string;
    descripcion: string;
    codFamilia: string; // Familia del producto, por defecto "EVEN"
};