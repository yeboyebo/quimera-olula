import { MetaModelo } from "@olula/lib/dominio.ts";
import { metaNuevaLineaVenta } from "../../venta/dominio.ts";
import { NuevaLineaAlbaran } from "../diseño.ts";

export const metaNuevaLineaAlbaran: MetaModelo<NuevaLineaAlbaran> = metaNuevaLineaVenta;

export const nuevaLineaAlbaranVacia: NuevaLineaAlbaran = {
    referencia: "",
    cantidad: 1,
} as NuevaLineaAlbaran;
