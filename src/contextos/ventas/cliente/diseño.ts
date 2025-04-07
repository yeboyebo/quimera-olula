import { Entidad } from "../../comun/diseño.ts";

export interface Cliente extends Entidad {
  id: string;
  nombre: string;
  id_fiscal: string;
  agente_id: string;
  divisa_id: string;
  tipo_id_fiscal: string;
  serie_id: string;
  forma_pago_id: string;
  grupo_iva_negocio_id: string;
};

export interface IdFiscal {
  id_fiscal: string;
  tipo_id_fiscal: string;
}

export type NuevoCliente = {
  nombre: string;
  id_fiscal: string;
  empresa_id: string;
  tipo_id_fiscal: string;
  agente_id: string;
};

export type DirCliente = {
  id: string;
  dir_envio: boolean;
  dir_facturacion: boolean;
  nombre_via: string;
  tipo_via: string;
  numero: string;
  otros: string;
  cod_postal: string;
  ciudad: string;
  provincia_id: number;
  provincia: string;
  pais_id: string;
  apartado: string;
  telefono: string;
};

export type NuevaDireccion = {
  nombre_via: string;
  tipo_via: string;
  ciudad: string;
};

export interface CuentaBanco extends Entidad {
  id: string;
  iban: string;
  bic: string;
};

export interface CrmContacto extends Entidad {
  id: string;
  nombre: string;
  email: string;
};

export type GetCliente = (id: string) => Promise<Cliente>;
export type PostCliente = (cliente: NuevoCliente) => Promise<string>;
export type PatchCliente = (id: string, cambios: Partial<{
  nombre: string;
  id_fiscal: string;
  grupo_id: string;
  telefono1: string;
  telefono2: string;
  email: string;
  web: string;
  observaciones: string;
  copiasfactura: number;
  fechabaja: string;
  contacto_id: string;
  forma_pago_id: string;
  divisa_id: string;
  serie_id: string;
  grupo_iva_negocio_id: string;
  agente_id: string;
  tipo_id_fiscal: string;
  de_baja: boolean;
}>) => Promise<void>;