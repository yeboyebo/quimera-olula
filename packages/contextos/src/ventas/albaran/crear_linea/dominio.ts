import { MetaModelo } from "@olula/lib/dominio.ts";
import { metaNuevaLineaLibreVenta, metaNuevaLineaVenta, nuevaLineaLibreVentaVacia } from "../../venta/dominio.ts";
import { NuevaLineaAlbaran, NuevaLineaLibreAlbaran } from "../diseño.ts";

export const metaNuevaLineaAlbaran: MetaModelo<NuevaLineaAlbaran> = metaNuevaLineaVenta;

export const nuevaLineaAlbaranVacia: NuevaLineaAlbaran = {
    referencia: "",
    cantidad: 1,
} as NuevaLineaAlbaran;

export const nuevaLineaLibreAlbaranVacia: NuevaLineaLibreAlbaran = nuevaLineaLibreVentaVacia;

export const metaNuevaLineaLibreAlbaran: MetaModelo<NuevaLineaLibreAlbaran> = metaNuevaLineaLibreVenta;
