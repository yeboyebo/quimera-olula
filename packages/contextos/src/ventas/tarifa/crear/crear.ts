import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevaTarifa } from "../diseño.js";

export const metaNuevaTarifa: MetaModelo<NuevaTarifa> = {
    campos: {
        nombre: { requerido: true, minimo: 1 },
        // Opcional: si se deja vacía, el servidor usa la divisa de la empresa.
        divisaId: { requerido: false },
    },
};

export const nuevaTarifaInicial = (): NuevaTarifa => ({
    nombre: "",
    divisaId: "",
});
