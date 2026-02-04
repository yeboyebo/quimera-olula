import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { Modulo } from "./diseño";

export const moduloVacio: Modulo = {
    id: "",
    nombre: "",
    descripcion: "",
    estado: "",
};

export const metaModulo: MetaModelo<Modulo> = {
    campos: {
        nombre: { requerido: true, validacion: (m: Modulo) => stringNoVacio(m.nombre) },
        descripcion: { requerido: false },
        estado: { requerido: true },
    },
};

export const nuevoModuloVacio: Partial<Modulo> = {
    nombre: "",
    descripcion: "",
    estado: "",
};

export const metaNuevoModulo: MetaModelo<Partial<Modulo>> = {
    campos: {
        nombre: { requerido: true, validacion: (m) => stringNoVacio(m.nombre || "") },
        descripcion: { requerido: false },
        estado: { requerido: true },
    },
};
