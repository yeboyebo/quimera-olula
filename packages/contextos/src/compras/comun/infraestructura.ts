import { ArticuloDeLineaConTipo } from "./diseño.ts";

/**
 * El bloque `articulo` que espera el servidor es excluyente: el id del catálogo,
 * el id con descripción personalizada, o solo la descripción de una línea libre.
 */
export type ArticuloLineaCompraApi =
    | { articulo_id: string; descripcion?: string }
    | { descripcion: string };

export const articuloLineaApi = (
    linea: ArticuloDeLineaConTipo
): ArticuloLineaCompraApi => {
    switch (linea.tipoArticulo) {
        case "registrado":
            return { articulo_id: linea.referencia! };
        case "generico":
            return { articulo_id: linea.referencia!, descripcion: linea.descripcion };
        case "libre":
            return { descripcion: linea.descripcion };
    }
};
