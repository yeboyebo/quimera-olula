import { MetaModelo } from "@olula/lib/dominio.js";
import { nuevoModuloInicial } from "../../crear/crear.js";
import { NuevoModLin } from "../diseño.js";

export const metaNuevoModLin: MetaModelo<NuevoModLin> = {
    campos: {
        campoString: { requerido: true, minimo: 3 },
    },
};

export const nuevoModLinVacio = (): NuevoModLin => nuevoModuloInicial();
