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
