import { CambioAgente } from "#/ventas/comun/componentes/moleculas/CambiarAgente/diseño.ts";
import { CambioDivisa } from "#/ventas/comun/componentes/moleculas/CambiarDivisa/diseño.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { CambioClienteVenta, ClienteVenta, LineaVenta, NuevaLineaVenta, NuevaVenta, Venta } from "../venta/diseño.ts";

export interface Albaran extends Venta {
    cliente: ClienteVenta;
    idfactura: string | null;
    por_comision: number;
    hora: string;
    almacen_id: string;
    nombre_almacen: string;
    de_abono: boolean;
    lineas: LineaAlbaran[];
}

export interface LineaAlbaran extends LineaVenta {
    otro_campo?: string;
}

export type NuevoAlbaran = NuevaVenta;

export type CambioClienteAlbaran = CambioClienteVenta;

export type NuevaLineaAlbaran = NuevaLineaVenta;

export type GetAlbaranes = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<Albaran>;

export type GetAlbaran = (id: string) => Promise<Albaran>;

export type GetReportAlbaran = (id: string) => Promise<Blob>;

export type GetLineasAlbaran = (id: string) => Promise<LineaAlbaran[]>;

export type PostAlbaran = (albaran: NuevoAlbaran) => Promise<string>;

export type PostLinea = (id: string, linea: NuevaLineaVenta) => Promise<string>;

export type PatchClienteAlbaran = (id: string, cambio: CambioClienteAlbaran) => Promise<void>;

export type PatchLinea = (id: string, linea: LineaAlbaran) => Promise<void>;

export type PatchArticuloLinea = (id: string, lineaId: string, referencia: string) => Promise<void>;

export type PatchCantidadLinea = (id: string, linea: LineaAlbaran, cantidad: number) => Promise<void>;

export type DeleteLinea = (id: string, lineaId: string) => Promise<void>;

export type PatchCambiarDivisa = (id: string, cambio: CambioDivisa) => Promise<void>;

export type PatchCambiarAgente = (id: string, cambio: CambioAgente) => Promise<void>;

export type FacturaCreada = {
    id: string;
};

export type PatchFacturarAlbaran = (id: string) => Promise<FacturaCreada>;

export type EstadoAlbaran = (
    'INICIAL' | 'ABIERTO' | 'FACTURADO'
    | 'BORRANDO_ALBARAN'
    | 'FACTURANDO_ALBARAN' | 'FACTURA_CREADA'
    | 'CAMBIANDO_CLIENTE'
    | 'CAMBIANDO_DESCUENTO'
    | 'CAMBIANDO_DIVISA'
    | 'CAMBIANDO_AGENTE'
    | 'CREANDO_LINEA' | 'BORRANDO_LINEA' | 'CAMBIANDO_LINEA'
);

export type EstadoMaestroAlbaran = ('INICIAL' | 'CREANDO_ALBARAN');

export type ContextoAlbaran = {
    estado: EstadoAlbaran;
    albaran: Albaran;
    albaranInicial: Albaran;
    lineaActiva: LineaAlbaran | null;
    facturaCreada: FacturaCreada | null;
};

export type ContextoMaestroAlbaran = {
    estado: EstadoMaestroAlbaran;
    albaranes: ListaActivaEntidades<Albaran>;
};
