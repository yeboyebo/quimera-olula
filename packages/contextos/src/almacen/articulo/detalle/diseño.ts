import { Articulo, CajaProveedorArticulo } from "../diseño.ts";

export type EstadoArticulo =
    | "INICIAL"
    | "ABIERTO"
    | "BORRANDO_ARTICULO"
    | "CREANDO_CAJA_PROVEEDOR"
    | "CAMBIANDO_CAJA_PROVEEDOR"
    | "BORRANDO_CAJA_PROVEEDOR";

export interface CajaProveedorActiva {
    proveedorId: string;
    caja: CajaProveedorArticulo | null;
}

export type ContextoArticulo = {
    estado: EstadoArticulo;
    articulo: Articulo;
    cajaProveedorActiva: CajaProveedorActiva | null;
};
