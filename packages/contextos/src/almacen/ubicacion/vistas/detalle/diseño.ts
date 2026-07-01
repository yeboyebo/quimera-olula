import { Ubicacion } from "../../diseño.ts";

export type EstadoUbicacion = "INICIAL" | "ABIERTO" | "BORRANDO";

export type ContextoUbicacion = {
    estado: EstadoUbicacion;
    ubicacion: Ubicacion;
};
