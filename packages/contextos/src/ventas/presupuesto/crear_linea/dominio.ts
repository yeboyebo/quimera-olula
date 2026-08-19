import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevaLinea, NuevaLineaLibre } from "../diseño.ts";

export const nuevaLineaVacia: NuevaLinea = {
    referencia: "",
    cantidad: 1,
};

export const metaNuevaLinea: MetaModelo<NuevaLinea> = {
    campos: {
        referencia: { requerido: true, tipo: "texto" },
        cantidad: { tipo: "decimal", requerido: true, decimales: 2 },
    }
};

export const nuevaLineaLibreVacia: NuevaLineaLibre = {
    descripcion: "",
    cantidad: 1,
    pvp_unitario: 0,
};

export const metaNuevaLineaLibre: MetaModelo<NuevaLineaLibre> = {
    campos: {
        descripcion: { requerido: true, tipo: "texto" },
        cantidad: { tipo: "decimal", requerido: true, decimales: 2 },
        pvp_unitario: { tipo: "moneda", requerido: true },
    }
};
