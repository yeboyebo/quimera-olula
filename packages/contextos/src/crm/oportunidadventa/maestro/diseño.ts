import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { OportunidadVenta } from "../diseño.ts";

export type EstadoMaestroOportunidades = "INICIAL" | "CREANDO";

export type ContextoMaestroOportunidades = {
    estado: EstadoMaestroOportunidades;
    oportunidades: ListaEntidades<OportunidadVenta>
};