import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Tarifa } from "../diseño.js";

/**
 * Estados posibles del maestro.
 */
export type EstadoMaestroTarifa = 'INICIAL' | 'CREANDO';

/**
 * Contexto del maestro (listado de tarifas)
 */
export type ContextoMaestroTarifa = {
    estado: EstadoMaestroTarifa;
    tarifas: ListaActivaEntidades<Tarifa>;
};
