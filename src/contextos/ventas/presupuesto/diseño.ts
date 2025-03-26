import { Direccion, Entidad, Filtro, Orden } from "../../comun/diseño.ts";

export interface Presupuesto extends Entidad {
  id: string;
  codigo: string;
  fecha: string;
  cliente_id: string;
  nombre_cliente: string;
  id_fiscal: string;
  direccion_id: string;
  direccion: Direccion;
  agente_id: string;
  nombre_agente: string;
  divisa_id: string;
  aprobado: boolean;
};

export type NuevoPresupuesto = {
  cliente_id: string;
  direccion_id: string;
  fecha: string;
  empresa_id: string;
};

export interface LineaPresupuesto extends Entidad {
  id: string;
  referencia: string;
  descripcion: string;
  cantidad: number;
  pvp_unitario: number;
  pvp_total: number;
};

export interface LineaPresupuestoNueva {
  referencia: string;
  cantidad: number;
};

export type Cliente = {
  cliente_id: string;
  direccion_id: string;
}

export type GetPresupuestos = (filtro: Filtro, orden: Orden) => Promise<Presupuesto[]>;

export type GetPresupuesto = (id: string) => Promise<Presupuesto>;

export type PostPresupuesto = (presupuesto: NuevoPresupuesto) => Promise<string>;

export type CambiarArticuloLinea = (id: string, lineaId: string, referencia: string) => Promise<void>;

export type CambiarCantidadLinea = (id: string, lineaId: string, cantidad: number) => Promise<void>;

export type PostLinea = (id: string, linea: LineaPresupuestoNueva) => Promise<string>;

export type DeleteLinea = (id: string, lineaId: string) => Promise<void>;

export type PatchCambiarDivisa = (id: string, divisaId: string) => Promise<void>;

