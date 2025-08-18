import { Direccion, Entidad, Filtro, Modelo, Orden, RespuestaLista } from "../../comun/diseño.ts";

export interface Presupuesto extends Entidad {
  id: string;
  codigo: string;
  fecha: string;
  fecha_salida: string;
  cliente_id: string;
  nombre_cliente: string;
  id_fiscal: string;
  direccion_id: string;
  direccion: Direccion;
  agente_id: string;
  nombre_agente: string;
  divisa_id: string;
  tasa_conversion: number;
  total: number;
  neto: number;
  total_iva: number;
  total_irpf: number;
  total_divisa_empresa: number;
  forma_pago_id: string;
  nombre_forma_pago: string;
  grupo_iva_negocio_id: string;
  aprobado: boolean;
  observaciones: string;
}

export type NuevoPresupuesto = {
  cliente_id: string;
  direccion_id: string;
  empresa_id: string;
};

export type CambioCliente = {
  cliente_id: string;
  nombre_cliente: string;
  direccion_id: string;
};

export interface LineaPresupuesto extends Entidad {
  id: string;
  referencia: string;
  descripcion: string;
  cantidad: number;
  pvp_unitario: number;
  dto_porcentual: number;
  pvp_total: number;
  grupo_iva_producto_id: string;
};

export interface NuevaLinea extends Modelo {
  referencia: string;
  cantidad: number;
};

export type Cliente = {
  cliente_id: string;
  direccion_id: string;
}

export type GetPresupuestos = (filtro: Filtro, orden: Orden) => RespuestaLista<Presupuesto>;

export type GetPresupuesto = (id: string) => Promise<Presupuesto>;

export type PostPresupuesto = (presupuesto: NuevoPresupuesto) => Promise<string>;

export type CambiarArticuloLinea = (id: string, lineaId: string, referencia: string) => Promise<void>;

export type PatchLinea = (id: string, linea: LineaPresupuesto) => Promise<void>;

export type CambiarCantidadLinea = (id: string, linea: LineaPresupuesto, cantidad: number) => Promise<void>;

export type PostLinea = (id: string, linea: NuevaLinea) => Promise<string>;

export type DeleteLinea = (id: string, lineaId: string) => Promise<void>;

export type PatchCambiarDivisa = (id: string, divisaId: string) => Promise<void>;

export type PatchPresupuesto = (id: string, presupuesto: Presupuesto) => Promise<void>;

