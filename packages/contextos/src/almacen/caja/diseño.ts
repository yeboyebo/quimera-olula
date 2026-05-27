import { Entidad } from "@olula/lib/diseño.ts";

export interface Caja extends Entidad {
    id: string;
    codigo_almacen: string;
    nombre_almacen?: string;
}

export interface CajaAPI extends Entidad {
    id: string;
    codigo_almacen: string;
}

export interface MovimientoCaja extends Entidad {
    id: string;
    sku: string;
    descripcion: string;
    cantidad: number;
}

export type NuevaCaja = {
    id: string;
    codigo_almacen: string;
};