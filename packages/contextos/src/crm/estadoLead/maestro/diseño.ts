import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { EstadoLead } from "../diseño.ts";

export type EstadoMaestroEstadosLead = "INICIAL" | "CREANDO";

export type ContextoMaestroEstadosLead = {
    estado: EstadoMaestroEstadosLead;
    estados_lead: ListaActivaEntidades<EstadoLead>
};