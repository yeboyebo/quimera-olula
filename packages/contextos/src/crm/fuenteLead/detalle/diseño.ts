import { FuenteLead } from "../diseño.ts";

export type EstadoDetalleFuenteLead = "INICIAL" | "BORRANDO";

export type ContextoDetalleFuenteLead = {
    estado: EstadoDetalleFuenteLead;
    fuente_lead: FuenteLead;
};