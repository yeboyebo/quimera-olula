import { Lead } from "../diseño.ts";

export type EstadoDetalleLead = "INICIAL" | "BORRANDO";

export type ContextoDetalleLead = {
    estado: EstadoDetalleLead;
    lead: Lead;
    inicial: Lead;
};