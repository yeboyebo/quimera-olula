import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Lead } from "../diseño.ts";

export type EstadoMaestroLeads = "INICIAL" | "CREANDO";

export type ContextoMaestroLeads = {
    estado: EstadoMaestroLeads;
    leads: ListaActivaEntidades<Lead>
}