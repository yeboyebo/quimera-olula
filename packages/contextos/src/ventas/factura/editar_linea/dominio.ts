import { metaLineaVenta } from "#/ventas/venta/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { LineaFactura } from "../diseño.ts";

export const metaLineaFactura: MetaModelo<LineaFactura> = {
    ...metaLineaVenta,
    campos: {
        ...metaLineaVenta.campos,
        tipo_irpf: { tipo: "decimal", requerido: false, decimales: 2 },
        tipo_recargo: { tipo: "decimal", requerido: false, decimales: 2 },
        por_comision: { tipo: "decimal", requerido: false, decimales: 2 },
    },
};
