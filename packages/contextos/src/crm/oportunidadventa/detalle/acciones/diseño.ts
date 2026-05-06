import { Accion } from "#/crm/accion/diseño.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";

export type EstadoAccionesOportunidad = "INICIAL" | "CREANDO" | "BORRANDO";

export type ContextoAccionesOportunidad = {
    estado: EstadoAccionesOportunidad;
    acciones: ListaEntidades<Accion>;
};