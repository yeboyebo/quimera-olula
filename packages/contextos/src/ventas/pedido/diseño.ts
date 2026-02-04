import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { CambioClienteVenta, LineaVenta, NuevaLineaVenta, NuevaVenta, Venta } from "../venta/diseño.ts";

export interface Pedido extends Venta {
  servido: string;
  lineas: LineaPedido[];
}
export interface LineaPedido extends LineaVenta {
  otro_campo?: string;
}

export type NuevoPedido = NuevaVenta

export type CambioClientePedido = CambioClienteVenta

export type NuevaLineaPedido = NuevaLineaVenta

export type GetPedidos = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<Pedido>;

export type GetPedido = (id: string) => Promise<Pedido>;

export type GetLineasPedido = (id: string) => Promise<LineaPedido[]>;

export type PostPedido = (presupuesto: NuevoPedido) => Promise<string>;

export type PostLinea = (id: string, linea: NuevaLineaVenta) => Promise<string>;

export type PatchPedido = (id: string, presupuesto: Pedido) => Promise<void>;

export type PatchClientePedido = (id: string, cambio: CambioClientePedido) => Promise<void>;

export type PatchLinea = (id: string, linea: LineaPedido) => Promise<void>;

export type PatchArticuloLinea = (id: string, lineaId: string, referencia: string) => Promise<void>;

export type PatchCantidadLinea = (id: string, linea: LineaPedido, cantidad: number) => Promise<void>;

export type DeleteLinea = (id: string, lineaId: string) => Promise<void>;


