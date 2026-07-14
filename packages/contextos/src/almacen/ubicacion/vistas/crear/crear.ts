export type NuevaUbicacion = {
    codigo: string;
    almacenId: string;
};

import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";

export const nuevaUbicacionVacia: NuevaUbicacion = {
    codigo: "",
    almacenId: "",
};

export const metaNuevaUbicacion: MetaModelo<NuevaUbicacion> = {
    campos: {
        codigo: { requerido: true, validacion: (m) => stringNoVacio(m.codigo || "") },
        almacenId: { requerido: true, validacion: (m) => stringNoVacio(m.almacenId || "") },
    },
};
