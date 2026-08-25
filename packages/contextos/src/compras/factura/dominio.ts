import { MetaModelo } from "@olula/lib/dominio.ts";
import { articuloDeLineaValido, costeDeLineaValido, getTipoArticulo } from "../comun/dominio.ts";
import {
    Factura,
    LineaFactura,
    ModeloLineaFactura,
    NuevaLineaFactura,
} from "./diseño.ts";

/**
 * Una factura cerrada (editable: false) rechaza con 409 los cambios que afectan
 * a los importes: líneas, proveedor, divisa, grupo de IVA, descuento, impuestos,
 * la rectificativa y el propio borrado.
 *
 * A diferencia del albarán, el cierre se puede levantar volviendo a poner
 * editable a true: el PATCH de editable nunca se bloquea a sí mismo.
 */
export const facturaEditable = (factura: Factura): boolean => factura.editable;

export const descripcionOrigenFactura = (factura: Factura): string =>
    factura.automatica ? "Desde albaranes" : "Manual";

/** Las líneas sin artículo de catálogo no tienen referencia: solo descripción. */
export const etiquetaLinea = (linea: LineaFactura): string =>
    linea.referencia ? `${linea.referencia}: ${linea.descripcion}` : linea.descripcion;

/** Las líneas añadidas a mano no cuelgan de ningún albarán. */
export const lineaDeAlbaran = (linea: LineaFactura): boolean => linea.albaranId !== null;

/** La línea llega del servidor sin el tipo de artículo: se infiere al abrir el formulario. */
export const modeloLineaFactura = (linea: LineaFactura): ModeloLineaFactura => ({
    ...linea,
    tipoArticulo: getTipoArticulo(linea),
});

export const metaLineaFactura: MetaModelo<ModeloLineaFactura> = {
    campos: {
        descripcion: { requerido: true },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvpUnitario: { requerido: true, tipo: "moneda", decimales: 2 },
        dtoPorcentual: { tipo: "decimal", decimales: 2 },
        dtoLineal: { tipo: "moneda", decimales: 2 },
        tipoIrpf: { tipo: "decimal", decimales: 2 },
        codigoAlbaran: { bloqueado: true },
        pvpSinDto: { tipo: "moneda", bloqueado: true },
        pvpTotal: { tipo: "moneda", bloqueado: true },
        tipoIva: { tipo: "decimal", bloqueado: true },
        tipoRecargo: { tipo: "decimal", bloqueado: true },
    },
    validacion: articuloDeLineaValido,
};

/**
 * El coste unitario solo se exige en líneas libres: con artículo del catálogo,
 * dejarlo vacío hace que el servidor lo resuelva desde articulosprov.
 */
export const metaNuevaLineaFactura: MetaModelo<NuevaLineaFactura> = {
    campos: {
        referencia: { tipo: "texto" },
        descripcion: { tipo: "texto" },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvpUnitario: { tipo: "moneda", decimales: 2 },
    },
    validacion: (linea) => articuloDeLineaValido(linea) && costeDeLineaValido(linea),
};

export const nuevaLineaFacturaVacia = (): NuevaLineaFactura => ({
    tipoArticulo: "registrado",
    referencia: null,
    descripcion: "",
    descripcionArticulo: null,
    cantidad: 1,
    pvpUnitario: null,
});
