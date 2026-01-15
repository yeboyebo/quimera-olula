import { MetaModelo } from "@olula/lib/dominio.js";

export type NuevoPagoEfectivo = {
    importe: number;
}

export const metaNuevoPagoEfectivo: MetaModelo<NuevoPagoEfectivo> = {
    campos: {
        importe: { tipo: "numero", requerido: true },
    }
};