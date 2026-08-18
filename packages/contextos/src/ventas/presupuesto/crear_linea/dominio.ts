import { MetaModelo } from "@olula/lib/dominio.js";
import { metaNuevaLineaLibreVenta, nuevaLineaLibreVentaVacia } from "../../venta/dominio.ts";
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

export const nuevaLineaLibreVacia: NuevaLineaLibre = nuevaLineaLibreVentaVacia;

export const metaNuevaLineaLibre: MetaModelo<NuevaLineaLibre> = metaNuevaLineaLibreVenta;
