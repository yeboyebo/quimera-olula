import { Incidencia } from "../diseño.ts";

export type EstadoMaestroIncidencias = "INICIAL" | "CREANDO";

export type ContextoMaestroIncidencias = {
    estado: EstadoMaestroIncidencias;
    incidencias: Incidencia[];
    totalIncidencias: number;
    activa: Incidencia | null;
};