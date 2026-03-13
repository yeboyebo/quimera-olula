import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { OportunidadVenta } from "../diseño.ts";

export type EstadoMaestroOportunidades = "INICIAL" | "CREANDO";

export type ContextoMaestroOportunidades = {
    estado: EstadoMaestroOportunidades;
    oportunidades: ListaActivaEntidades<OportunidadVenta>
};