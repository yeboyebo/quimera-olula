import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { NuevaCaja } from "../diseño.ts";

export const nuevaCajaVacia: NuevaCaja = {
    id: "",
    ubicacionId: "",
};

export const metaNuevaCaja: MetaModelo<NuevaCaja> = {
    campos: {
        id: {
            requerido: true,
            validacion: (m: NuevaCaja) => stringNoVacio(m.id),
        },
        ubicacionId: {
            requerido: true,
            validacion: (m: NuevaCaja) => stringNoVacio(m.ubicacionId),
        },
    },
};
