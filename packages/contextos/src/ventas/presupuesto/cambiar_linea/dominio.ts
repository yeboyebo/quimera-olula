import { MetaModelo } from "@olula/lib/dominio.js";
import { metaLineaVenta } from "../../venta/dominio.ts";
import { LineaPresupuesto } from "../diseño.ts";

export const metaLinea: MetaModelo<LineaPresupuesto> = {
    campos: {
        ...metaLineaVenta.campos,
        id: { requerido: true },
        descripcion: { requerido: true },
        grupo_iva_producto_id: { requerido: true },
        iva_incluido: { tipo: "checkbox", requerido: false },
    }
};
