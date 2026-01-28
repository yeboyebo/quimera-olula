import { OportunidadVenta } from "../diseño.ts";

export type EstadoDetalleOportunidad = "INICIAL" | "BORRANDO";

export type ContextoDetalleOportunidad = {
    estado: EstadoDetalleOportunidad;
    oportunidad: OportunidadVenta;
};