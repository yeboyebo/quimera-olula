import { MetaModelo } from "@olula/lib/dominio.ts";
import {
    Albaran,
    LineaAlbaran,
    NuevaLineaAlbaran,
    NuevaLineaLibreAlbaran,
} from "./diseño.ts";

/**
 * Un albarán con factura rechaza con 409 los cambios que afectan a lo facturado:
 * líneas, proveedor, divisa, grupo de IVA, descuento, importes e impuestos, y el
 * propio borrado. Sí acepta fecha, hora, nº de proveedor, almacén, forma de pago
 * y observaciones.
 *
 * Nota: no hay factura de compra en el servidor, así que nada marca un albarán
 * como facturado desde la API; el 409 solo aparece en los que ya venían así.
 */
export const albaranFacturado = (albaran: Albaran): boolean => albaran.facturaId !== null;

export const descripcionEstadoFactura = (albaran: Albaran): string =>
    albaranFacturado(albaran) ? "Facturado" : "Pendiente de facturar";

/** Las líneas sin artículo de catálogo no tienen referencia: solo descripción. */
export const etiquetaLinea = (linea: LineaAlbaran): string =>
    linea.referencia ? `${linea.referencia}: ${linea.descripcion}` : linea.descripcion;

/** Las líneas añadidas a mano no vienen de un pedido y no mueven nada en ninguno. */
export const lineaDePedido = (linea: LineaAlbaran): boolean => linea.pedidoId !== null;

export const metaLineaAlbaran: MetaModelo<LineaAlbaran> = {
    campos: {
        descripcion: { requerido: true },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvpUnitario: { requerido: true, tipo: "moneda", decimales: 2 },
        dtoPorcentual: { tipo: "decimal", decimales: 2 },
        dtoLineal: { tipo: "moneda", decimales: 2 },
        tipoIrpf: { tipo: "decimal", decimales: 2 },
        pvpSinDto: { tipo: "moneda", bloqueado: true },
        pvpTotal: { tipo: "moneda", bloqueado: true },
        tipoIva: { tipo: "decimal", bloqueado: true },
        tipoRecargo: { tipo: "decimal", bloqueado: true },
    },
};

export const metaNuevaLineaAlbaran: MetaModelo<NuevaLineaAlbaran> = {
    campos: {
        referencia: { requerido: true, tipo: "texto" },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvpUnitario: { requerido: true, tipo: "moneda", decimales: 2 },
    },
};

export const metaNuevaLineaLibreAlbaran: MetaModelo<NuevaLineaLibreAlbaran> = {
    campos: {
        descripcion: { requerido: true },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvpUnitario: { requerido: true, tipo: "moneda", decimales: 2 },
    },
};

export const nuevaLineaAlbaranVacia = (): NuevaLineaAlbaran => ({
    referencia: "",
    descripcion: "",
    cantidad: 1,
    pvpUnitario: 0,
});

export const nuevaLineaLibreAlbaranVacia = (): NuevaLineaLibreAlbaran => ({
    descripcion: "",
    cantidad: 1,
    pvpUnitario: 0,
});
