import { MetaModelo } from "@olula/lib/dominio.js";
import { metaLineaVenta } from "../../venta/dominio.ts";
import { LineaPedido } from "../diseño.ts";

export const metaLinea: MetaModelo<LineaPedido> = {
    campos: {
        ...metaLineaVenta.campos,
        id: { requerido: true },
        descripcion: { requerido: true },
        grupo_iva_producto_id: { requerido: true },
        iva_incluido: { tipo: "checkbox", requerido: false },
    }
};
