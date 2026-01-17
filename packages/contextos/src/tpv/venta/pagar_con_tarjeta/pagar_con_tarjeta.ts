import { divisaTpv } from "#/tpv/comun/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevoPagoTarjeta } from "./diseño.ts";

export const nuevoPagoTarjetaVacio: NuevoPagoTarjeta = {
    importe: 0
}

export const metaNuevoPagoTarjeta: MetaModelo<NuevoPagoTarjeta> = {
    campos: {
        importe: { tipo: "moneda", divisa: divisaTpv, requerido: true },
    }
};