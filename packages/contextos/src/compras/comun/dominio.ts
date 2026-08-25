import { ArticuloDeLinea, ArticuloDeLineaConTipo, TipoArticuloLinea } from "./diseño.ts";

/**
 * Infiere el tipo de artículo de una línea recibida del servidor. Una línea con
 * referencia cuya descripción no es la del catálogo es genérica.
 */
export const getTipoArticulo = (linea: ArticuloDeLinea): TipoArticuloLinea =>
    linea.referencia
        ? linea.descripcion === linea.descripcionArticulo
            ? "registrado"
            : "generico"
        : "libre";

/** Registrado necesita referencia; libre, descripción; genérico, las dos. */
export const articuloDeLineaValido = (linea: ArticuloDeLineaConTipo): boolean => {
    switch (linea.tipoArticulo) {
        case "registrado":
            return !!linea.referencia;
        case "generico":
            return !!linea.referencia && !!linea.descripcion;
        case "libre":
            return !!linea.descripcion;
    }
};

/**
 * El coste unitario solo es obligatorio en líneas libres. Con artículo del
 * catálogo se puede omitir: el servidor lo resuelve desde articulosprov para el
 * proveedor del documento, y si no hay registro la línea entra a 0.
 */
export const costeDeLineaValido = (linea: {
    tipoArticulo: TipoArticuloLinea;
    pvpUnitario: number | null;
}): boolean =>
    linea.tipoArticulo !== "libre" ||
    (linea.pvpUnitario !== null && linea.pvpUnitario !== undefined);
