import { MetaModelo } from "@olula/lib/dominio.js";
import { PagoRemesa } from "./diseño.js";

export const pagoRemesaVacio = (): PagoRemesa => ({
    fecha: new Date(),
});

export const metaPagoRemesa: MetaModelo<PagoRemesa> = {
    campos: {
        fecha: { tipo: "fecha", requerido: true },
    },
};
