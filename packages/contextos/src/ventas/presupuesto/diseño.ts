import { CambioDivisa } from "#/ventas/comun/componentes/moleculas/CambiarDivisa/diseño.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { CambioClienteVenta, ClienteVenta, LineaVenta, NuevaLineaVenta, Venta } from "../venta/diseño.ts";

export interface Presupuesto extends Venta {
  cliente: ClienteVenta;
  fecha_salida: Date;
  aprobado: boolean;
  por_comision: number;
  almacen_id: string;
  lineas: LineaPresupuesto[];
  servido?: string;
}

export type NuevoPresupuesto = {
  cliente_id: string;
  direccion_id: string;
  empresa_id: string;
  oportunidad_id?: string | null;
}

export type NuevoPresupuestoClienteNoRegistrado = {
  empresa_id: string;
  // Campos para cliente no registrado
  nombre_cliente: string;
  id_fiscal: string;
  // Campos de dirección no registrada
  nombre_via: string;
  tipo_via?: string;
  numero?: string;
  otros?: string;
  cod_postal?: string;
  ciudad?: string;
  provincia?: string;
  pais_id?: string;
  apartado?: string;
  telefono?: string;
};

export type CambioClientePresupuesto = CambioClienteVenta;

export interface LineaPresupuesto extends LineaVenta {
  otro_campo?: string;
};

export type NuevaLinea = NuevaLineaVenta

/**
 * Línea sin artículo de catálogo. El servidor no exige `articulo_id`: basta con
 * descripción, cantidad y pvp_unitario (que puede ser 0).
 */
export type NuevaLineaLibre = {
  descripcion: string;
  cantidad: number;
  pvp_unitario: number;
}

export const esLineaConArticulo = (
  linea: NuevaLinea | NuevaLineaLibre
): linea is NuevaLinea => 'referencia' in linea;

export type Cliente = {
  cliente_id: string;
  direccion_id: string;
}

export const esClienteRegistrado = (presupuesto: NuevoPresupuesto | NuevoPresupuestoClienteNoRegistrado): presupuesto is NuevoPresupuesto => {
  return 'cliente_id' in presupuesto;
};

export type GetPresupuestos = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<Presupuesto>;

export type GetPresupuesto = (id: string) => Promise<Presupuesto>;

export type GetReportPresupuesto = (id: string) => Promise<Blob>;

export type PostPresupuesto = (presupuesto: NuevoPresupuesto | NuevoPresupuestoClienteNoRegistrado) => Promise<string>;

export type CambiarArticuloLinea = (id: string, lineaId: string, referencia: string) => Promise<void>;

export type PatchLinea = (id: string, linea: LineaPresupuesto) => Promise<void>;

export type CambiarCantidadLinea = (id: string, linea: LineaPresupuesto, cantidad: number) => Promise<void>;

export type PostLinea = (id: string, linea: NuevaLinea | NuevaLineaLibre) => Promise<string>;

export type DeleteLinea = (id: string, lineaId: string) => Promise<void>;

export type PatchCambiarDivisa = (id: string, cambio: CambioDivisa) => Promise<void>;

export type PedidoCreado = {
  id: string;
  codigo: string;
};

export type PatchAprobarPresupuesto = (id: string) => Promise<PedidoCreado>;


export type EstadoMaestroPresupuesto = (
  'INICIAL' | 'CREANDO_PRESUPUESTO'
);


export type ContextoMaestroPresupuesto = {
  estado: EstadoMaestroPresupuesto;
  presupuestos: ListaActivaEntidades<Presupuesto>;
};

export type EstadoPresupuesto = (
  'INICIAL' | 'ABIERTO' | 'APROBADO'
  | 'BORRANDO_PRESUPUESTO'
  | 'APROBANDO_PRESUPUESTO' | 'PEDIDO_CREADO'
  | 'CAMBIANDO_DIVISA'
  | 'CAMBIANDO_CLIENTE'
  | 'CAMBIANDO_DESCUENTO'
  | 'CAMBIANDO_AGENTE'
  | 'CREANDO_LINEA' | 'BORRANDO_LINEA' | 'CAMBIANDO_LINEA'
);

export type ContextoPresupuesto = {
  estado: EstadoPresupuesto;
  presupuesto: Presupuesto;
  presupuestoInicial: Presupuesto;
  lineaActiva: LineaPresupuesto | null;
  pedidoCreado: PedidoCreado | null;
};