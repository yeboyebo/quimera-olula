import { Entidad } from "@olula/lib/diseño.ts";

export interface Caja extends Entidad {
    id: string;
    ubicacionId: string;
    contenedorId?: string | null;
}

export interface CajaAPI extends Entidad {
    id: string;
    ubicacion_id: string;
    contenedor_id?: string | null;
}

export interface MovimientoCaja extends Entidad {
    id: string;
    sku: string;
    descripcion: string;
    cantidad: number;
}

export interface MovimientoCajaAPI {
    id: string;
    sku: string;
    descripcion: string;
    cantidad: number;
}

// Caja con su contenido completo (árbol de materiales + subcajas)
export interface CajaContenido extends Caja {
    contenido: ComponenteCaja[];
}

export interface CajaContenidoAPI extends CajaAPI {
    contenido: ComponenteCajaAPI[];
}

export type ComponenteCaja = CajaContenido | MovimientoCaja;
export type ComponenteCajaAPI = CajaContenidoAPI | MovimientoCajaAPI;

export type NuevaCaja = {
    id: string;
    ubicacionId: string;
    contenedorId?: string | null;
};
