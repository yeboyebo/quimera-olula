import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.ts";
import { Factura } from "../../factura/diseño.ts";

const importe = (factura: Factura) =>
  formatearMoneda(factura.total, factura.divisa_id);

/** Descripción por defecto cuando ya sabemos de qué cliente es la factura. */
export const facturaDeCliente = (factura: Factura) =>
  `${factura.codigo} - ${importe(factura)} - ${formatearFechaDate(factura.fecha)}`;

/** Descripción por defecto cuando la factura puede ser de cualquier cliente. */
export const facturaConCliente = (factura: Factura) =>
  `${factura.cliente?.nombre_cliente ?? ""} - ${facturaDeCliente(factura)}`;
