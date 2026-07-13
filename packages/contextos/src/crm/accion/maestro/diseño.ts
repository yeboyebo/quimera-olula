import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Accion } from "../diseño.ts";

export type EstadoMaestroAcciones = "INICIAL" | "CREANDO" | "FINALIZANDO";

export type ContextoMaestroAcciones = {
    estado: EstadoMaestroAcciones;
    acciones: ListaActivaEntidades<Accion>;
};