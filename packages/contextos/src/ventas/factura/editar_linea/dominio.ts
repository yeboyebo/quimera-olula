import { metaLineaVenta } from "#/ventas/venta/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { LineaFactura } from "../diseño.ts";

export const metaLineaFactura: MetaModelo<LineaFactura> = metaLineaVenta;
