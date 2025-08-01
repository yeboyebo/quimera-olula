import { Entidad } from "../../comun/diseño.ts";


export interface Contacto extends Entidad {
  id: string;
  nombre: string;
  email: string;
};

export type NuevoContacto = {
  nombre: string;
  email: string;
};

export type GetContacto = (id: string) => Promise<Contacto>;
export type PatchContacto = (id: string, contacto: Contacto) => Promise<void>;