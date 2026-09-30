import { ReciboVenta } from "../diseño.js";

export type EstadoDetalleReciboVenta =
    | 'INICIAL'
    | 'ABIERTO'
    | 'PAGANDO'
    | 'ENLACE_COBRO'
    | 'DESAGRUPANDO';

export type ContextoDetalleReciboVenta = {
    estado: EstadoDetalleReciboVenta;
    recibo: ReciboVenta;
};
