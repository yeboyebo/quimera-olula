import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevaLineaModulo } from "../diseño.js";

export const nuevaLineaModuloVacia = (): NuevaLineaModulo => ({
    campoString: '',
});

export const metaNuevaLineaModulo: MetaModelo<NuevaLineaModulo> = {
    campos: {
        campoString: { requerido: true, minimo: 1 },
    },
};
