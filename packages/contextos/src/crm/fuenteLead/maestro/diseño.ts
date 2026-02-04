import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { FuenteLead } from "../diseño.ts";

export type EstadoMaestroFuentesLead = "INICIAL" | "CREANDO";

export type ContextoMaestroFuentesLead = {
    estado: EstadoMaestroFuentesLead;
    fuentes_lead: ListaEntidades<FuenteLead>
};