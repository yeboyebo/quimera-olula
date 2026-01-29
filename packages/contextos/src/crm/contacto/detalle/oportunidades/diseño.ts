import { OportunidadVenta } from "#/crm/oportunidadventa/diseño.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";

export type EstadoOportunidadesContacto = "INICIAL" | "CREANDO" | "BORRANDO";

export type ContextoOportunidadesContacto = {
    estado: EstadoOportunidadesContacto;
    oportunidades: ListaEntidades<OportunidadVenta>;
};