import { MetaModelo } from "@olula/lib/dominio.js";
import { ReciboVenta } from "../../diseño.js";
import { cuentaUltimoPago } from "../../dominio.js";
import { DevolucionRecibo } from "./diseño.js";

/** La cuenta se precarga con la del último pago y no se puede cambiar. */
export const devolucionReciboVacia = (recibo: ReciboVenta): DevolucionRecibo => {
    const cuenta = cuentaUltimoPago(recibo);
    return {
        cuenta_pago_id: cuenta?.id ?? "",
        nombre_cuenta_pago: cuenta?.nombre ?? "",
        fecha: new Date(),
    };
};

export const metaDevolucionRecibo: MetaModelo<DevolucionRecibo> = {
    campos: {
        cuenta_pago_id: { requerido: true },
        fecha: { tipo: "fecha", requerido: true },
    },
};
