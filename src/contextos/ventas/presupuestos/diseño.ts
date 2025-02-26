import { Entidad } from "../../comun/diseño.ts";
import { Direccion } from "../cliente/diseño.ts";

export type Presupuesto = Entidad & {
  id: string;
  codigo: string;
  fecha: string;
  cliente_id: string;
  nombre_cliente: string;
  id_fiscal: string;
  direccion_id: string;
  direccion: Direccion;
};
