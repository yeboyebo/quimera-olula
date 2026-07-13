import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { NuevaCaja } from "../diseño.ts";

export const nuevaCajaVacia = (): NuevaCaja => ({
    ubicacionId: "",
});

export const metaNuevaCaja: MetaModelo<NuevaCaja> = {
    campos: {
        ubicacionId: {
            requerido: true,
            validacion: (m: NuevaCaja) => stringNoVacio(m.ubicacionId),
        },
    },
};
