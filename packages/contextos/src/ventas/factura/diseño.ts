import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { CambioClienteVenta, LineaVenta, NuevaLineaVenta, NuevaVenta, Venta } from "../venta/diseño.ts";

export interface Factura extends Venta {
    otro_campo?: string;
}
export interface LineaFactura extends LineaVenta {
    otro_campo?: string;
}

export type NuevaFactura = NuevaVenta;

export type CambioClienteFactura = CambioClienteVenta;

export type NuevaLineaFactura = NuevaLineaVenta;

export type GetFacturas = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<Factura>;

export type GetFactura = (id: string) => Promise<Factura>;

export type GetLineasFactura = (id: string) => Promise<LineaFactura[]>;

export type PostFactura = (factura: NuevaFactura) => Promise<string>;

export type PostLinea = (id: string, linea: NuevaLineaVenta) => Promise<string>;

export type PatchFactura = (id: string, factura: Factura) => Promise<void>;

export type PatchClienteFactura = (id: string, cambio: CambioClienteFactura) => Promise<void>;

export type PatchLinea = (id: string, linea: LineaFactura) => Promise<void>;

export type PatchArticuloLinea = (id: string, lineaId: string, referencia: string) => Promise<void>;

export type PatchCantidadLinea = (id: string, linea: LineaFactura, cantidad: number) => Promise<void>;

export type DeleteLinea = (id: string, lineaId: string) => Promise<void>;
