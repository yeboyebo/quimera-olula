import { metaNuevaVenta, nuevaVentaVacia } from "#/ventas/venta/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { NuevaFactura } from "../diseño.ts";

export const metaNuevaFactura: MetaModelo<NuevaFactura> = metaNuevaVenta;

export const nuevaFacturaVacia: NuevaFactura = nuevaVentaVacia;
