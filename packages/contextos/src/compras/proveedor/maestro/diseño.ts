import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { Proveedor } from "../diseño.ts";

export type EstadoMaestroProveedor = 'INICIAL' | 'CREANDO';

export type ContextoMaestroProveedor = {
    estado: EstadoMaestroProveedor;
    proveedores: ListaActivaEntidades<Proveedor>;
};
