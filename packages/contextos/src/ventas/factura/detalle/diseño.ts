import { MetaModelo, modeloEsEditable, modeloEsValido } from "@olula/lib/dominio.ts";
import { metaVenta } from "../../venta/dominio.ts";
import { ContextoFactura, EstadoFactura, Factura, LineaFactura } from "../diseño.ts";

export type { ContextoFactura, EstadoFactura, Factura, LineaFactura };

export const metaFactura: MetaModelo<Factura> = {
    campos: {
        ...metaVenta.campos,
        fecha: { tipo: "fecha", requerido: false },
        divisa_id: { requerido: true, bloqueado: true },
        tasa_conversion: { tipo: "numero", requerido: true, bloqueado: true },
        agente_id: { bloqueado: true },
        por_comision: { tipo: "decimal", requerido: false, decimales: 2, positivo: true, maximo: 100, bloqueado: true },
    },
    editable: (factura: Factura, _?: string) => {
        return factura.editable ?? false;
    },
};

export const editable = modeloEsEditable<Factura>(metaFactura);
export const facturaValida = modeloEsValido<Factura>(metaFactura);

