import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevaLinea } from "../diseño.ts";

export const nuevaLineaVacia: NuevaLinea = {
    referencia: "",
    cantidad: 1,
};

export const metaNuevaLinea: MetaModelo<NuevaLinea> = {
    campos: {
        referencia: { requerido: true },
        cantidad: { tipo: "decimal", requerido: true, decimales: 2 },
    }
};
