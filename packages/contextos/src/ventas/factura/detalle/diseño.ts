import { MetaModelo, modeloEsEditable, modeloEsValido } from "@olula/lib/dominio.ts";
import { metaVenta } from "../../venta/dominio.ts";
import { ContextoFactura, EstadoFactura, Factura } from "../diseño.ts";

export type { ContextoFactura, EstadoFactura, Factura };

export const metaFactura: MetaModelo<Factura> = {
    campos: {
        ...metaVenta.campos,
        fecha: { tipo: "fecha", requerido: false },
    },
    editable: (factura: Factura, _?: string) => {
        return factura.editable ?? false;
    },
};

export const editable = modeloEsEditable<Factura>(metaFactura);
export const facturaValida = modeloEsValido<Factura>(metaFactura);

