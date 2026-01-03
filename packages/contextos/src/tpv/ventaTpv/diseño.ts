import { Factura } from "#/ventas/factura/diseño.ts";
import { CambioClienteVenta, LineaVenta, NuevaLineaVenta, Venta } from "#/ventas/venta/diseño.ts";
import { Entidad, Filtro, ListaSeleccionable, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { MetaModelo } from "@olula/lib/dominio.js";

export interface VentaTpv extends Venta {
    pendiente: number;
    pagado: number;
}




export interface LineaFactura extends LineaVenta {
    otro_campo?: string;
}

export interface LineaADevolver extends LineaFactura {
    aDevolver: number;
}

export interface VentaTpvADevolver extends VentaTpv {
    lineas: LineaFactura[];
}

export interface PagoVentaTpv extends Entidad {
    id: string;
    importe: number;
    forma_pago: string;
    fecha: string;
}


export type NuevaVentaTpv = {
    agente_id: string;
    punto_venta_id: string;
}

export type LineaPorBarcode = {
    barcode: string;
    cantidad: number;
}

export type CambioClienteFactura = CambioClienteVenta;

export type NuevaLineaFactura = NuevaLineaVenta;

export type NuevoPagoEfectivo = {
    importe: number;
}

export type NuevoPagoVale = {
    importe: number;
    vale_id: string;
}

type PagoTpv = {
    importe: number;
    formaPago: string;
    idVale?: string
}

export const metaNuevoPagoEfecctivo: MetaModelo<NuevoPagoEfectivo> = {
    campos: {
        importe: { tipo: "numero", requerido: true },
    }
};

export const metaNuevoPagoVale: MetaModelo<NuevoPagoEfectivo> = {
    campos: {
        importe: { tipo: "numero", requerido: true },
        vale_id: { requerido: true },
    }
};


export type GetVentasTpv = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<VentaTpv>;

export type GetVentaTpv = (id: string) => Promise<VentaTpv>;

export type GetVentaTpvADevolver = (id: string) => Promise<VentaTpvADevolver>;

export type GetLineasFactura = (id: string) => Promise<LineaFactura[]>;

export type GetPagosVentaTpv = (id: string) => Promise<PagoVentaTpv[]>;

export type PostVentaTpv = () => Promise<string>;

export type PostLinea = (id: string, linea: NuevaLineaVenta) => Promise<string>;

export type PostPago = (id: string, pago: PagoTpv) => Promise<string>;

export type PostLineaPorBarcode = (id: string, lineaPorBarcode: LineaPorBarcode) => Promise<string>;

export type PostEmitirVale = (venta: VentaTpv) => Promise<void>;

export type PatchFactura = (id: string, factura: Factura) => Promise<void>;

export type PatchClienteFactura = (id: string, cambio: CambioClienteFactura) => Promise<void>;

export type PatchDevolverVenta = (id: string, venta: VentaTpv, lineasADevolver: LineaADevolver[]) => Promise<void>;

export type PatchLinea = (id: string, linea: LineaFactura) => Promise<void>;

export type PatchArticuloLinea = (id: string, lineaId: string, referencia: string) => Promise<void>;

export type PatchCantidadLinea = (id: string, linea: LineaFactura, cantidad: number) => Promise<void>;

export type DeleteLinea = (id: string, lineaId: string) => Promise<void>;

export type DeletePago = (id: string, idPago: string) => Promise<void>;

export type EstadoVentaTpv = (
    'INICIAL' | "ABIERTA" | "EMITIDA"
    | "BORRANDO_VENTA"
    | "PAGANDO_EN_EFECTIVO" | "PAGANDO_CON_TARJETA" | "PAGANDO_CON_VALE"
    | "BORRANDO_PAGO"
    | "CREANDO_LINEA" | "BORRANDO_LINEA" | "CAMBIANDO_LINEA"
    | "DEVOLVIENDO_VENTA" | "EMITIENDO_VALE"
);

export type ContextoVentaTpv = {
    estado: EstadoVentaTpv,
    venta: VentaTpv;
    ventaInicial: VentaTpv;
    pagos: ListaSeleccionable<PagoVentaTpv>;
    lineas: ListaSeleccionable<LineaFactura>;
    eventos: [string, unknown][];
    // publicar: EmitirEvento;
};