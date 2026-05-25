import { Entidad, Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";

export interface Stock extends Entidad {
    id: string;
    articuloId: string;
    almacenId: string;
    cantidadFisica: number;
    cantidadDisponible: number;
}

export interface StockAPI extends Entidad {
    id: string;
    articulo_id: string;
    almacen_id: string;
    cantidad_fisica: number;
    cantidad_disponible: number;
}

export type GetStock = (id: string) => Promise<Stock>;
export type GetStocks = (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
) => Promise<{ datos: Stock[] }>;
