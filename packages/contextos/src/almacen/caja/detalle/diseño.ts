import { CajaContenido } from "../diseño.ts";

export type EstadoCaja = "INICIAL" | "ABIERTO" | "BORRANDO_CAJA";

export type ContextoCaja = {
    estado: EstadoCaja;
    caja: CajaContenido;
    cajaInicial: CajaContenido;
};
