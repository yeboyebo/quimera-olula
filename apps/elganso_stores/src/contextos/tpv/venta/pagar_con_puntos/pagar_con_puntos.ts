import { divisaTpv } from "#/tpv/comun/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevoPagoPuntos } from "./diseño.ts";

export const nuevoPagoPuntosInicial: NuevoPagoPuntos = {
    importe: 0,
    pendiente: 0,
    saldoDisponible: null
}

// El tope real por % (empleado/día del empleado, dtoespecial) lo impone
// solo el backend (ver apps/el_ganso/comandos/tpv/venta/aplicacion/crear_pago
// en olula_servidor_fork) — aquí no se replica ese cálculo. El saldo sí se
// valida también aquí (mismo criterio que pagar_con_vale) porque ya lo
// tenemos disponible vía getTopePuntos.
const importeValido = (pago: NuevoPagoPuntos): boolean | string => {
    if (pago.importe > pago.pendiente) {
        return "El importe no puede ser mayor que el pendiente";
    }
    if (pago.saldoDisponible !== null && pago.importe > pago.saldoDisponible) {
        return "El importe no puede ser mayor que el saldo disponible";
    }
    if (pago.importe == 0) {
        return false;
    }
    return true;
}

export const metaNuevoPagoPuntos: MetaModelo<NuevoPagoPuntos> = {
    campos: {
        importe: { tipo: "moneda", divisa: divisaTpv, requerido: true, validacion: importeValido },
    }
};
