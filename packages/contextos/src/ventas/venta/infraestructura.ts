import { AltaLineaVenta, ArticuloLinea, ArticuloLineaGenerico, ArticuloLineaLibre, ArticuloLineaRegistrado } from "./diseño.ts";

export interface ArticuloLineaRegistradoApi {
    articulo_id: string;
    pvp_unitario?: number;
}
export interface ArticuloLineaGenericoApi extends ArticuloLineaRegistradoApi {
    descripcion: string;
}
export interface ArticuloLineaLibreApi {
    descripcion: string;
    pvp_unitario: number;
}
export type ArticuloLineaApi =
    | ArticuloLineaRegistradoApi
    | ArticuloLineaGenericoApi
    | ArticuloLineaLibreApi;

export type AltaLineaVentaApi = {
    articulo: ArticuloLineaApi;
    cantidad: number;
};

const articuloLineaApi = (articulo: ArticuloLinea): ArticuloLineaApi => {
    if (!('articuloId' in articulo)) return articuloLibreApi(articulo);
    if ('descripcion' in articulo) return articuloGenericoApi(articulo);
    return articuloRegistradoApi(articulo);
};

const articuloRegistradoApi = (a: ArticuloLineaRegistrado): ArticuloLineaRegistradoApi => ({
    articulo_id: a.articuloId,
    ...(a.pvpUnitario !== undefined ? { pvp_unitario: a.pvpUnitario } : {}),
});

const articuloGenericoApi = (a: ArticuloLineaGenerico): ArticuloLineaGenericoApi => ({
    articulo_id: a.articuloId,
    descripcion: a.descripcion,
    ...(a.pvpUnitario !== undefined ? { pvp_unitario: a.pvpUnitario } : {}),
});

const articuloLibreApi = (a: ArticuloLineaLibre): ArticuloLineaLibreApi => ({
    descripcion: a.descripcion,
    pvp_unitario: a.pvpUnitario,
});

/**
 * Convierte un alta de línea de dominio (camelCase) al cuerpo que espera el
 * servidor (snake_case). Común a los cuatro documentos de venta.
 */
export const altaLineaApi = ({ articulo, cantidad }: AltaLineaVenta): AltaLineaVentaApi => ({
    articulo: articuloLineaApi(articulo),
    cantidad,
});