import { Accion } from "../diseño.ts";

export type EstadoMaestroAcciones = "INICIAL" | "CREANDO";

export type ContextoMaestroAcciones = {
    estado: EstadoMaestroAcciones;
    acciones: Accion[];
    totalAcciones: number;
    activa: Accion | null;
};