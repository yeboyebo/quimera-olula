import { Filtro, Orden, RespuestaLista } from "../../comun/diseño.ts";
import { CambioClienteVenta, LineaVenta, NuevaLineaVenta, NuevaVenta, Venta } from "../venta/diseño.ts";

export interface Albaran extends Venta {
    otro_campo?: string;
}
export interface LineaAlbaran extends LineaVenta {
    otro_campo?: string;
}

export type NuevoAlbaran = NuevaVenta;

export type CambioClienteAlbaran = CambioClienteVenta;

export type NuevaLineaAlbaran = NuevaLineaVenta;

export type GetAlbaranes = (filtro: Filtro, orden: Orden) => RespuestaLista<Albaran>;

export type GetAlbaran = (id: string) => Promise<Albaran>;

export type GetLineasAlbaran = (id: string) => Promise<LineaAlbaran[]>;

export type PostAlbaran = (albaran: NuevoAlbaran) => Promise<string>;

export type PostLinea = (id: string, linea: NuevaLineaVenta) => Promise<string>;

export type PatchAlbaran = (id: string, albaran: Albaran) => Promise<void>;

export type PatchClienteAlbaran = (id: string, cambio: CambioClienteAlbaran) => Promise<void>;

export type PatchLinea = (id: string, linea: LineaAlbaran) => Promise<void>;

export type PatchArticuloLinea = (id: string, lineaId: string, referencia: string) => Promise<void>;

export type PatchCantidadLinea = (id: string, linea: LineaAlbaran, cantidad: number) => Promise<void>;

export type DeleteLinea = (id: string, lineaId: string) => Promise<void>;
