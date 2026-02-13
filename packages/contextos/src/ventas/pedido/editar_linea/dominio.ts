import { MetaModelo } from "@olula/lib/dominio.js";
import { LineaPedido } from "../diseño.ts";

export const metaLinea: MetaModelo<LineaPedido> = {
    campos: {
        id: { requerido: true },
        referencia: { requerido: true },
        descripcion: { requerido: true },
        cantidad: { tipo: "decimal", requerido: true, decimales: 2 },
        pvp_unitario: { requerido: true },
        dto_porcentual: { requerido: false },
        grupo_iva_producto_id: { requerido: true },
    }
};
