import { MetaModelo } from "@olula/lib/dominio.js";
import { MotivoIgnorarMovimiento } from "./diseño.js";

/** Constante estable (no función): useModelo la usa como dependencia por referencia. */
export const motivoIgnorarVacio: MotivoIgnorarMovimiento = { motivo: "" };

export const metaMotivoIgnorarMovimiento: MetaModelo<MotivoIgnorarMovimiento> = {
    campos: {
        motivo: {},
    },
};
