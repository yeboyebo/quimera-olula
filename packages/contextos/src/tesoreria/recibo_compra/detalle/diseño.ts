import { ReciboCompra } from "../diseño.js";

export type EstadoDetalleReciboCompra =
    | 'INICIAL'
    | 'ABIERTO'
    | 'ORDENANDO_PAGO';

export type ContextoDetalleReciboCompra = {
    estado: EstadoDetalleReciboCompra;
    recibo: ReciboCompra;
};
