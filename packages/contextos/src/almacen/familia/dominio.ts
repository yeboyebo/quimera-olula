import { MetaTabla } from "@olula/componentes/index.js";
import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { Familia, NuevaFamilia } from "./diseño";

export const familiaVacia: Familia = {
    id: "",
    descripcion: "",
};

export const metaFamilia: MetaModelo<Familia> = {
    campos: {
        descripcion: { requerido: true, validacion: (m: Familia) => stringNoVacio(m.descripcion) },
    },
};

// export const nuevaFamiliaVacia: Partial<Familia> = {
export const nuevaFamiliaVacia: NuevaFamilia = {
    id: "",
    descripcion: "",
};

export const metaNuevaFamilia: MetaModelo<Partial<Familia>> = {
    campos: {
        descripcion: { requerido: true, validacion: (m) => stringNoVacio(m.descripcion || "") },
    },
};

export const metaTablaFamilia: MetaTabla<Familia> = [
    { id: "id", cabecera: "Código Familia" },
    { id: "descripcion", cabecera: "Descripcion" },
];

