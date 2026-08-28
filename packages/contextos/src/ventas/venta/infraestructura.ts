import { LineaVenta, NuevaLineaVenta } from "./diseño.ts";
import { getTipoArticulo } from "./dominio.ts";

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

export type NuevaLineaVentaApiReq = {
    articulo: ArticuloLineaApi;
    cantidad: number;
    // pvp_total: number;
};

export const articuloDeLinea = (
    linea: LineaVenta
) => {
    switch (getTipoArticulo(linea)) {
        case "generico":
            return { articulo_id: linea.referencia!, descripcion: linea.descripcion };
        case "registrado":
            return { articulo_id: linea.referencia! };
        case "libre":
            return { descripcion: linea.descripcion };
    }
}

// const articuloAltaLineaApi = (articulo: ArticuloLinea): ArticuloLineaApi => {
//     if (!('articuloId' in articulo)) return articuloAltaLibreApi(articulo);
//     if ('descripcion' in articulo) return articuloAltaGenericoApi(articulo);
//     return articuloAltaRegistradoApi(articulo);
// };

const articuloAltaLineaApi = (linea: NuevaLineaVenta): ArticuloLineaApi => {
    if (!linea.idArticulo) return articuloAltaLibreApi(linea);
    if (linea.descripcion) return articuloAltaGenericoApi(linea);
    return articuloAltaRegistradoApi(linea);
};

// const articuloAltaRegistradoApi = (a: ArticuloLineaRegistrado): ArticuloLineaRegistradoApi => ({
//     articulo_id: a.articuloId,
//     ...(a.pvpUnitario !== undefined ? { pvp_unitario: a.pvpUnitario } : {}),
// });

// const articuloAltaGenericoApi = (a: ArticuloLineaGenerico): ArticuloLineaGenericoApi => ({
//     articulo_id: a.articuloId,
//     descripcion: a.descripcion,
//     ...(a.pvpUnitario !== undefined ? { pvp_unitario: a.pvpUnitario } : {}),
// });

// const articuloAltaLibreApi = (a: ArticuloLineaLibre): ArticuloLineaLibreApi => ({
//     descripcion: a.descripcion,
//     pvp_unitario: a.pvpUnitario,
// });

const articuloAltaRegistradoApi = (linea: NuevaLineaVenta): ArticuloLineaRegistradoApi => ({
    articulo_id: linea.idArticulo!,
    ...(linea.pvpUnitario !== null ? { pvp_unitario: linea.pvpUnitario } : {}),
});

const articuloAltaGenericoApi = (linea: NuevaLineaVenta): ArticuloLineaGenericoApi => ({
    articulo_id: linea.idArticulo!,
    descripcion: linea.descripcion!,
    ...(linea.pvpUnitario !== null ? { pvp_unitario: linea.pvpUnitario } : {}),
});

const articuloAltaLibreApi = (linea: NuevaLineaVenta): ArticuloLineaLibreApi => ({
    descripcion: linea.descripcion!,
    pvp_unitario: linea.pvpUnitario!,
});


/**
 * Convierte un alta de línea de dominio (camelCase) al cuerpo que espera el
 * servidor (snake_case). Común a los cuatro documentos de venta.
 */
export const altaLineaApi = (linea: NuevaLineaVenta): NuevaLineaVentaApiReq => ({
    articulo: articuloAltaLineaApi(linea),
    cantidad: linea.cantidad,
});

// export const altaLineaDesdeApi = (lineaApi: NuevaLineaVentaApi): NuevaLineaVenta => ({
//     idArticulo: 'articulo_id' in lineaApi.articulo ? lineaApi.articulo.articulo_id : null,
//     descripcion: 'descripcion' in lineaApi.articulo ? lineaApi.articulo.descripcion : null,
//     pvpUnitario: lineaApi.articulo.pvp_unitario || null,
//     cantidad: lineaApi.cantidad,
//     pvpTotal: lineaApi.pvp_total,
// })

// ==========================
// Hacer interfaces de alta planos ?

// interface NuevaLineaVenta {
//     idArticulo: string | null;
//     descripcion: string | null;
//     descripcionArticulo: string | null;
//     pvpUnitario: number | null;
//     cantidad: number;
//     pvpTotal: number | null;
// }

// interface AltaLineaApiReq {
//     articulo_id?: string;
//     descripcion?: string;
//     cantidad: number;
//     pvp_unitario?: number;
// }

export interface NuevaLineaVentaApiRes {
    articulo_id: string | null;
    descripcion: string;
    cantidad: number;
    pvp_unitario: number;
    pvp_total: number;
}

// export function altaLineaVentaAApi(linea: NuevaLineaVenta): AltaLineaApiReq {
//     return {
//         ...(linea.idArticulo ? { articulo_id: linea.idArticulo } : {}),
//         ...(linea.descripcion ? { descripcion: linea.descripcion } : {}),
//         cantidad: linea.cantidad,
//         ...(linea.pvpUnitario ? { pvp_unitario: linea.pvpUnitario } : {}),
//     };
// }

export function apiANuevaLineaVenta<T extends NuevaLineaVenta>(lineaAnterior: T, lineaApi: NuevaLineaVentaApiRes): T {
    return {
        ...lineaAnterior,
        idArticulo: lineaApi.articulo_id,
        descripcion: lineaApi.descripcion,
        pvpUnitario: lineaApi.pvp_unitario,
        cantidad: lineaApi.cantidad,
        pvpTotal: lineaApi.pvp_total,
    } as T;
}