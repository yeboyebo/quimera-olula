import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Lead } from "../diseño.ts";

export type EstadoMaestroLeads = "INICIAL" | "CREANDO";

export type ContextoMaestroLeads = {
    estado: EstadoMaestroLeads;
    leads: ListaEntidades<Lead>
}