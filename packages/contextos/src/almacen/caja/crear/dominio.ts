import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { NuevaCaja } from "../diseño.ts";

export const nuevaCajaVacia: NuevaCaja = {
    id: "",
    codigo_almacen: "",
};

export const metaNuevaCaja: MetaModelo<NuevaCaja> = {
    campos: {
        id: {
            requerido: true,
            validacion: (m: NuevaCaja) => stringNoVacio(m.id),
        },
        codigo_almacen: {
            requerido: true,
            validacion: (m: NuevaCaja) => stringNoVacio(m.codigo_almacen),
        },
    },
};
