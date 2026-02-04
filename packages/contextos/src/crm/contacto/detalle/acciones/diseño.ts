import { Accion } from "#/crm/accion/diseño.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";

export type EstadoAccionesContacto = "INICIAL" | "CREANDO" | "BORRANDO";

export type ContextoAccionesContacto = {
    estado: EstadoAccionesContacto;
    acciones: ListaEntidades<Accion>;
};