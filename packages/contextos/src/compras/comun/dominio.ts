import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.ts";
import { ArticuloDeLinea, ArticuloDeLineaConTipo, TipoArticuloLinea } from "./diseño.ts";

export const getTipoArticulo = (linea: ArticuloDeLinea): TipoArticuloLinea =>
    linea.referencia
        ? linea.descripcion === linea.descripcionArticulo
            ? "registrado"
            : "generico"
        : "libre";

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

/** Franja de datos clave del detalle de un documento de compra. */
export const datosClaveDocumentoCompra = (documento: {
    fecha: Date;
    nombreFormaPago: string | null;
    total: number;
    divisaId: string;
}) => [
    { etiqueta: "Fecha", valor: documento.fecha ? formatearFechaDate(new Date(documento.fecha)) : "—" },
    { etiqueta: "Forma de pago", valor: documento.nombreFormaPago || "—" },
    { etiqueta: "Total", valor: formatearMoneda(documento.total ?? 0, documento.divisaId || "EUR") },
];
