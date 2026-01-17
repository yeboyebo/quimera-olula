import { divisaTpv } from "#/tpv/comun/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.js";

export type NuevoPagoEfectivo = {
    importe: number;
}

export const metaNuevoPagoEfectivo: MetaModelo<NuevoPagoEfectivo> = {
    campos: {
        importe: { requerido: true, tipo: "moneda", divisa: divisaTpv },
    }
};