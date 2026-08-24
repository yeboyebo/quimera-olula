/**
 * Tipo de artículo de una línea de compra:
 * - `registrado`: artículo del catálogo con su propia descripción.
 * - `libre`: sin artículo, solo descripción escrita a mano.
 * - `generico`: artículo del catálogo con descripción personalizada.
 */
export type TipoArticuloLinea = "registrado" | "libre" | "generico";

/** Campos de artículo comunes a cualquier línea de compra, de pedido o de albarán. */
export type ArticuloDeLinea = {
    referencia: string | null;
    /** Descripción efectiva de la línea: la del catálogo o la personalizada. */
    descripcion: string;
    /** Descripción del catálogo. Distinta de `descripcion` en las líneas genéricas. */
    descripcionArticulo: string | null;
};

/** `ArticuloDeLinea` con el tipo ya resuelto, tal y como lo maneja el formulario. */
export type ArticuloDeLineaConTipo = ArticuloDeLinea & {
    tipoArticulo: TipoArticuloLinea;
};
