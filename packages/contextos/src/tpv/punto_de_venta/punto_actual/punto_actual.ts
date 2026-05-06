import { MetaModelo } from "@olula/lib/dominio.js";
import { PuntoVentaTpv } from "../diseño.ts";
import { CambioPuntoVentaActual } from "./diseño.ts";

export const metaCambioPuntoVentaActual: MetaModelo<CambioPuntoVentaActual> = {

    campos: {
        idPunto: { requerido: true },
    },

    onChange: (cambioPuntoVenta, campo, _, otros) => {
        if (campo === "idPunto" && otros) {
            const nuevoValor: CambioPuntoVentaActual = {
                ...cambioPuntoVenta,
                punto: otros.punto as PuntoVentaTpv
            }
            return nuevoValor
        }
        return cambioPuntoVenta
    }
};