import { MetaModelo } from "@olula/lib/dominio.js";
import { LineaModulo } from "../diseño.js";

export const metaLineaModuloEdicion: MetaModelo<LineaModulo> = {
    campos: {
        campoString: { requerido: true, minimo: 1 },
    },
};
