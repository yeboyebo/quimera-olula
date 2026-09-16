import { MetaModelo } from "@olula/lib/dominio.js";
import { ArticuloTarifa, NuevoArticuloTarifa } from "./diseño.js";

export const metaArticuloTarifa: MetaModelo<ArticuloTarifa> = {
    campos: {
        articuloId: { requerido: true, tipo: "autocompletar" },
        precio: { requerido: true, tipo: "decimal", decimales: 2, positivo: true },
    },
    // El artículo no se puede cambiar: solo el precio. Para moverlo de tarifa
    // se borra la línea y se crea otra.
    editable: (_articuloTarifa: ArticuloTarifa, campo?: string) =>
        campo !== "articuloId",
};

export const metaNuevoArticuloTarifa: MetaModelo<NuevoArticuloTarifa> = {
    campos: {
        articuloId: { requerido: true, tipo: "autocompletar" },
        precio: { requerido: true, tipo: "decimal", decimales: 2, positivo: true },
    },
};

export const nuevoArticuloTarifaVacio = (): NuevoArticuloTarifa => ({
    articuloId: "",
    descripcionArticulo: "",
    precio: 0,
});

/**
 * Texto con el que se identifica un artículo-tarifa en mensajes de confirmación.
 */
export const descripcionArticuloTarifa = (articuloTarifa: ArticuloTarifa): string =>
    articuloTarifa.descripcionArticulo
        ? `${articuloTarifa.articuloId} - ${articuloTarifa.descripcionArticulo}`
        : articuloTarifa.articuloId;
