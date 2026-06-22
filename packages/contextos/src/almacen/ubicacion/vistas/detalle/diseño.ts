import { Ubicacion } from "../../diseño.ts";

export type EstadoUbicacion = "INICIAL" | "Editando" | "Borrando";

export type ContextoUbicacion = {
    estado: EstadoUbicacion;
    ubicacion: Ubicacion;
    ubicacionInicial: Ubicacion;
};
