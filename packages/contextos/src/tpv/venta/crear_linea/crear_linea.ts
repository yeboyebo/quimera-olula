import { metaNuevaLineaVenta, nuevaLineaVentaVacia } from "#/ventas/venta/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevaLineaFactura } from "./diseño.ts";

export const nuevaLineaFacturaVacia: NuevaLineaFactura = nuevaLineaVentaVacia;
export const metaNuevaLineaFactura: MetaModelo<NuevaLineaFactura> = metaNuevaLineaVenta;
