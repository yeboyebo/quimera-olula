import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { IaTareaProgramada } from "../diseño.js";

export type EstadoMaestroIaTareaProgramada = 'INICIAL' | 'CREANDO';

export type ContextoMaestroIaTareaProgramada = {
    estado: EstadoMaestroIaTareaProgramada;
    tareas: ListaActivaEntidades<IaTareaProgramada>;
};
