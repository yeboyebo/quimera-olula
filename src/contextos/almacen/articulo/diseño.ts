import { Entidad } from "../../comun/diseño.ts";

export interface ArticuloAlmacen extends Entidad {
    id: string;
    descripcion: string;
};
