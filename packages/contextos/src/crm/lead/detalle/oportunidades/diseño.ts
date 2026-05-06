import { OportunidadVenta } from "#/crm/oportunidadventa/diseño.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";

export type EstadoOportunidadesLead = "INICIAL" | "CREANDO" | "BORRANDO";

export type ContextoOportunidadesLead = {
    estado: EstadoOportunidadesLead;
    oportunidades: ListaEntidades<OportunidadVenta>;
};