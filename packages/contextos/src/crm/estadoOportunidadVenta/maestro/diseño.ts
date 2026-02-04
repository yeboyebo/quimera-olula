import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { EstadoOportunidad } from "../diseño.ts";

export type EstadoMaestroEstadosOportunidad = "INICIAL" | "CREANDO";

export type ContextoMaestroEstadosOportunidad = {
    estado: EstadoMaestroEstadosOportunidad;
    estados_oportunidad: ListaEntidades<EstadoOportunidad>
};