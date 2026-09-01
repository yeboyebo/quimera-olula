import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { Factura } from "../diseño.ts";

export type EstadoMaestroFactura = 'INICIAL' | 'CREANDO';

export type ContextoMaestroFactura = {
    estado: EstadoMaestroFactura;
    facturas: ListaActivaEntidades<Factura>;
};
