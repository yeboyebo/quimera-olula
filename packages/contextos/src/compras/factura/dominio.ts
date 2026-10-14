import { MetaModelo } from "@olula/lib/dominio.ts";
import { articuloDeLineaValido, getTipoArticulo } from "../comun/dominio.ts";
import {
    EstadoExpedicion,
    Factura,
    LineaFactura,
    ModeloLineaFactura,
    NuevaLineaFactura,
} from "./diseño.ts";

export const facturaEditable = (factura: Factura): boolean => factura.editable;

const ESTADOS_EXPEDICION: Record<string, EstadoExpedicion> = {
    BORRADOR: "BORRADOR",
    REGISTRADA: "REGISTRADA",
};

/**
 * Normaliza lo que manda el servidor antes de compararlo. Sin esto, un
 * "Borrador" en vez de "BORRADOR" no casaría con ninguna rama y la factura se
 * trataría como no registrable.
 */
export const estadoExpedicionDesdeApi = (
    valor: string | null | undefined
): EstadoExpedicion => {
    const clave = (valor ?? "").trim().toUpperCase().replace(/[\s.-]+/g, "_");
    return ESTADOS_EXPEDICION[clave] ?? "";
};

export const descripcionEstadoExpedicion: Record<EstadoExpedicion, string> = {
    "": "Sin cargar",
    BORRADOR: "Borrador",
    REGISTRADA: "Registrada",
};

/** Solo se registra el borrador: registrar es irreversible. */
export const facturaRegistrable = (factura: Factura): boolean =>
    factura.estadoExpedicion === "BORRADOR";

/**
 * Reabrir solo tiene sentido en la factura que bloqueó la contabilidad: es el
 * asiento lo que pone `editable` a false, no el usuario.
 */
export const facturaReabrible = (factura: Factura): boolean =>
    factura.asientoId !== null;

export const descripcionOrigenFactura = (factura: Factura): string =>
    factura.automatica ? "Desde albaranes" : "Manual";

export const etiquetaLinea = (linea: LineaFactura): string =>
    linea.referencia ? `${linea.referencia}: ${linea.descripcion}` : linea.descripcion;

export const lineaDeAlbaran = (linea: LineaFactura): boolean => linea.albaranId !== null;

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

export const metaNuevaLineaFactura: MetaModelo<NuevaLineaFactura> = {
    campos: {
        referencia: { tipo: "texto" },
        descripcion: { tipo: "texto" },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvpUnitario: {
            requerido: (linea) => linea.tipoArticulo === "libre",
            tipo: "moneda",
            decimales: 2,
        },
    },
    validacion: articuloDeLineaValido,
};

export const nuevaLineaFacturaVacia = (): NuevaLineaFactura => ({
    tipoArticulo: "registrado",
    referencia: null,
    descripcion: "",
    descripcionArticulo: null,
    cantidad: 1,
    pvpUnitario: null,
});
