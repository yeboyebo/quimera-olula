import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevoPagoVale } from "./diseño.ts";

export const nuevoPagoValeInicial: NuevoPagoVale = {
    importe: 0,
    saldoVale: 0,
    pendiente: 0,
    vale_id: ""
}

const validacionNuevoPagoVale = (pago: NuevoPagoVale) => {
    if (pago.importe == 0) {
        return false;
    }
    if (pago.importe < 0) {
        return "El importe no puede ser negativo";
    }
    if (pago.importe > pago.saldoVale) {
        return "El importe no puede ser mayor que el saldo del vale";
    }
    if (pago.importe > pago.pendiente) {
        return "El importe no puede ser mayor que el importe a pagar " + pago.importe + " " + pago.pendiente;
    }
    return true;
}

export const metaNuevoPagoVale: MetaModelo<NuevoPagoVale> = {
    campos: {
        importe: { tipo: "numero", requerido: true, validacion: validacionNuevoPagoVale },
        saldoVale: { tipo: "numero", requerido: true },
        vale_id: { tipo: "texto", requerido: true },
    }
};