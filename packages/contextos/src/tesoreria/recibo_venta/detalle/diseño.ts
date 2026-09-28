import { ReciboVenta } from "../diseño.js";

export type EstadoDetalleReciboVenta =
    | 'INICIAL'
    | 'ABIERTO' | 'VIENDO_TRAZA'
    | 'PAGANDO'
    | 'DESAGRUPANDO';

export type ContextoDetalleReciboVenta = {
    estado: EstadoDetalleReciboVenta;
    recibo: ReciboVenta;
};
