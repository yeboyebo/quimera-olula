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
  eventos: [];
};

export interface IdFiscal {
  id_fiscal: string;
  tipo_id_fiscal: string;
}

// export interface ClienteConDirecciones {
//   id: string;
//   direcciones: DireccionCliente[];
// };



export type Direccion = {
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