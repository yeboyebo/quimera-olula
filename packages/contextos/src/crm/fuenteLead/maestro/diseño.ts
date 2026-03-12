import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { FuenteLead } from "../diseño.ts";

export type EstadoMaestroFuentesLead = "INICIAL" | "CREANDO";

export type ContextoMaestroFuentesLead = {
    estado: EstadoMaestroFuentesLead;
    fuentes_lead: ListaActivaEntidades<FuenteLead>
};