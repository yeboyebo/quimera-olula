import { PuntoVentaTpv } from "../diseño.ts";

export type CambioPuntoVentaActual = {
    idPunto: string | null,
    nombre: string | null,
    punto: PuntoVentaTpv | null,
};