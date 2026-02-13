import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevaLineaPedido } from "../diseño.ts";

export const nuevaLineaVacia: NuevaLineaPedido = {
    referencia: "",
    cantidad: 1,
};

export const metaNuevaLinea: MetaModelo<NuevaLineaPedido> = {
    campos: {
        referencia: { requerido: true },
        cantidad: { tipo: "decimal", requerido: true, decimales: 2 },
    }
};
