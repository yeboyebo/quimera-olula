import { Filtro, Orden, Paginacion, RespuestaLista } from "../../comun/diseño.ts";

export type TransferenciaStock = {
    id: string;
    origen: string;
    destino: string;
    nombre_origen: string;
    nombre_destino: string;
    fecha: string;
}

export type LineaTransferenciaStock = {
    id: string;
    transferencia_id: string;
    sku: string;
    descripcion_producto: string;
    cantidad: number;
}

export type NuevaTransferenciaStock = Omit<TransferenciaStock, "id" | "nombre_origen" | "nombre_destino">;
export type NuevaLineaTransferenciaStock = Omit<LineaTransferenciaStock, "id" | "transferencia_id" | "descripcion_producto">;

export type TransferenciaStock_API = {
    id: string;
    almacen_origen_id: string;
    almacen_destino_id: string;
    nombre_almacen_origen: string;
    nombre_almacen_destino: string;
    fecha: string;
};
export type LineaTransferenciaStock_API = {
    id: string;
    transferencia_id: string;
    sku: string;
    descripcion: string;
    cantidad: number;
};

export type NuevaTransferenciaStock_API = Omit<TransferenciaStock_API, "id" | "nombre_almacen_origen" | "nombre_almacen_destino">;
export type NuevaLineaTransferenciaStock_API = Omit<LineaTransferenciaStock_API, "id" | "transferencia_id" | "descripcion">;

export type ObtenerTransferenciasStock = (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
) => RespuestaLista<TransferenciaStock>;

export type ObtenerTransferenciaStock = (id: string) => Promise<TransferenciaStock>;
export type CrearTransferenciaStock = (transferencia: NuevaTransferenciaStock) => Promise<string>;
export type ActualizarTransferenciaStock = (id: string, transferencia: Partial<TransferenciaStock>) => Promise<void>;
export type EliminarTransferenciaStock = (id: string) => Promise<void>;

export type ObtenerLineasTransferenciaStock = (
    id: string,
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
) => RespuestaLista<LineaTransferenciaStock>;

export type ObtenerLineaTransferenciaStock = (id: string, idLinea: string) => Promise<LineaTransferenciaStock>;
export type CrearLineaTransferenciaStock = (transferencia_id: string, linea: NuevaLineaTransferenciaStock) => Promise<string>;
export type ActualizarLineaTransferenciaStock = (id: string, idLinea: string, linea: Partial<LineaTransferenciaStock>) => Promise<void>;
export type EliminarLineaTransferenciaStock = (id: string, idLinea: string) => Promise<void>;
