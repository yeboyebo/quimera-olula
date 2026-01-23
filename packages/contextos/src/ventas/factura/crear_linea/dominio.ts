// crear_linea/dominio.ts
import { metaNuevaLineaVenta, nuevaLineaVentaVacia } from "#/ventas/venta/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { NuevaLineaFactura } from "../diseño.ts";

export const metaNuevaLineaFactura: MetaModelo<NuevaLineaFactura> = metaNuevaLineaVenta;

export const nuevaLineaFacturaVacia: NuevaLineaFactura = nuevaLineaVentaVacia;
