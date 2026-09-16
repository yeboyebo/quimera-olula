import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ReciboVenta } from "../diseño.js";

export type EstadoMaestroReciboVenta = 'INICIAL' | 'AGRUPANDO';

export type ContextoMaestroReciboVenta = {
    estado: EstadoMaestroReciboVenta;
    recibos: ListaActivaEntidades<ReciboVenta>;
    seleccionados: string[];
};
