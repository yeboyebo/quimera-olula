import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { EstadoLead } from "../diseño.ts";

export type EstadoMaestroEstadosLead = "INICIAL" | "CREANDO";

export type ContextoMaestroEstadosLead = {
    estado: EstadoMaestroEstadosLead;
    estados_lead: ListaEntidades<EstadoLead>
};