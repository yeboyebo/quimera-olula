import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Accion } from "../diseño.ts";

export type EstadoMaestroAcciones = "INICIAL" | "CREANDO";

export type ContextoMaestroAcciones = {
    estado: EstadoMaestroAcciones;
    acciones: ListaActivaEntidades<Accion>;
};