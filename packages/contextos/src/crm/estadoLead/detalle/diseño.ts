import { EstadoLead } from "../diseño.ts";

export type EstadoDetalleEstadoLead = "INICIAL" | "BORRANDO";

export type ContextoDetalleEstadoLead = {
    estado: EstadoDetalleEstadoLead;
    estado_lead: EstadoLead;
};