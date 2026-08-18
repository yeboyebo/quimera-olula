import { AlbaranCreado } from "#/ventas/albaranarPedido/diseño.ts";
import { CambioAgente } from "#/ventas/comun/componentes/moleculas/CambiarAgente/diseño.ts";
import { CambioDivisa } from "#/ventas/comun/componentes/moleculas/CambiarDivisa/diseño.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { CambioClienteVenta, ClienteVenta, LineaVenta, NuevaLineaLibreVenta, NuevaLineaVenta, NuevaVenta, Venta } from "../venta/diseño.ts";

export interface Pedido extends Venta {
  cliente: ClienteVenta;
  servido: string;
  por_comision: number;
  fecha_salida: Date | null;
  almacen_id: string;
  nombre_almacen: string;
  lineas: LineaPedido[];
}
export interface LineaPedido extends LineaVenta {
  otro_campo?: string;
}

export type NuevoPedido = NuevaVenta

export type CambioClientePedido = CambioClienteVenta

export type NuevaLineaPedido = NuevaLineaVenta

export type NuevaLineaLibrePedido = NuevaLineaLibreVenta

export type GetPedidos = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<Pedido>;

export type GetPedido = (id: string) => Promise<Pedido>;

export type GetReportPedido = (id: string) => Promise<Blob>;

export type GetLineasPedido = (id: string) => Promise<LineaPedido[]>;

export type PostPedido = (presupuesto: NuevoPedido) => Promise<string>;

export type PostLinea = (id: string, linea: NuevaLineaVenta | NuevaLineaLibreVenta) => Promise<string>;

export type PatchClientePedido = (id: string, cambio: CambioClientePedido) => Promise<void>;

export type PatchLinea = (id: string, linea: LineaPedido) => Promise<void>;

export type PatchArticuloLinea = (id: string, lineaId: string, referencia: string) => Promise<void>;

export type PatchCantidadLinea = (id: string, linea: LineaPedido, cantidad: number) => Promise<void>;

export type DeleteLinea = (id: string, lineaId: string) => Promise<void>;

export type PatchCambiarDivisa = (id: string, cambio: CambioDivisa) => Promise<void>;

export type PatchCambiarAgente = (id: string, cambio: CambioAgente) => Promise<void>;

export type EstadoPedido = (
    'INICIAL' | 'ABIERTO' | 'SERVIDO'
    | 'BORRANDO_PEDIDO'
    | 'CAMBIANDO_CLIENTE'
    | 'CAMBIANDO_DESCUENTO'
    | 'CAMBIANDO_DIVISA'
    | 'CAMBIANDO_AGENTE'
    | 'CREANDO_LINEA' | 'BORRANDO_LINEA' | 'CAMBIANDO_LINEA'
);

export type EstadoMaestroPedido = (
    'INICIAL' | 'CREANDO_PEDIDO' | 'ALBARANANDO_PEDIDOS' | 'ALBARANES_CREADOS'
);

export type ContextoPedido<T extends Pedido = Pedido> = {
    estado: EstadoPedido;
    pedido: T;
    pedidoInicial: T;
    lineaActiva: LineaPedido | null;
};

export type ContextoMaestroPedido = {
    estado: EstadoMaestroPedido;
    pedidos: ListaActivaEntidades<Pedido>;
    seleccionados: string[];
    albaranesCreados: AlbaranCreado[];
    fallidos: string[];
};
