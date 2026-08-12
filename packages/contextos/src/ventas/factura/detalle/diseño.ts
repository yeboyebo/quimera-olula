import { MetaModelo, modeloEsEditable, modeloEsValido } from "@olula/lib/dominio.ts";
import { metaVenta } from "../../venta/dominio.ts";
import { ContextoFactura, EstadoFactura, Factura, LineaFactura } from "../diseño.ts";

export type { ContextoFactura, EstadoFactura, Factura, LineaFactura };

export const metaFactura: MetaModelo<Factura> = {
    campos: {
        ...metaVenta.campos,
        fecha: { tipo: "fecha", requerido: false },
        hora: { tipo: "hora", requerido: false },
        por_comision_agente: { tipo: "decimal", decimales: 2, requerido: false },
        automatica: { tipo: "checkbox", requerido: false },
        servicios: { tipo: "checkbox", requerido: false },
    },
    editable: (factura: Factura, _?: string) => {
        return factura.editable ?? false;
    },
};

export const editable = modeloEsEditable<Factura>(metaFactura);
export const facturaValida = modeloEsValido<Factura>(metaFactura);

