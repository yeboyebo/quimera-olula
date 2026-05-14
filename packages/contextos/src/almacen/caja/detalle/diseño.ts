import { Caja } from "../diseño.ts";

export type EstadoCaja = "INICIAL" | "ABIERTO" | "BORRANDO_CAJA";

export type ContextoCaja = {
    estado: EstadoCaja;
    caja: Caja;
    cajaInicial: Caja;
};
