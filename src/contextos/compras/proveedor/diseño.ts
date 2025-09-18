import { Entidad } from "../../comun/diseño.ts";

export interface Proveedor extends Entidad {
  id: string;
  nombre: string;
};

export type NuevoProveedor = {
  nombre: string;
};


export type GetProveedor = (id: string) => Promise<Proveedor>;
export type PostProveedor = (proveedor: NuevoProveedor) => Promise<string>;
export type PatchProveedor = (id: string, proveedor: Proveedor) => Promise<void>;