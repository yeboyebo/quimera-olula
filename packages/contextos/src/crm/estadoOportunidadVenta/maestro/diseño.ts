import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { EstadoOportunidad } from "../diseño.ts";

export type EstadoMaestroEstadosOportunidad = "INICIAL" | "CREANDO";

export type ContextoMaestroEstadosOportunidad = {
    estado: EstadoMaestroEstadosOportunidad;
    estados_oportunidad: ListaActivaEntidades<EstadoOportunidad>
};