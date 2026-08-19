import { MetaModelo } from "@olula/lib/dominio.js";
import { metaNuevaLineaLibreVenta, nuevaLineaLibreVentaVacia } from "../../venta/dominio.ts";
import { NuevaLineaLibrePedido, NuevaLineaPedido } from "../diseño.ts";

export const nuevaLineaVacia: NuevaLineaPedido = {
    referencia: "",
    cantidad: 1,
};

export const metaNuevaLinea: MetaModelo<NuevaLineaPedido> = {
    campos: {
        referencia: { requerido: true, tipo: "texto" },
        cantidad: { tipo: "decimal", requerido: true, decimales: 2 },
    }
};

export const nuevaLineaLibreVacia: NuevaLineaLibrePedido = nuevaLineaLibreVentaVacia;

export const metaNuevaLineaLibre: MetaModelo<NuevaLineaLibrePedido> = metaNuevaLineaLibreVenta;
