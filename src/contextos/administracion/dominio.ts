import { Grupo, Regla } from "./diseño.ts";

export const grupoVacio: Grupo = {
    id: "",
    descripcion: "",
};

export const reglaVacia: Regla = {
    id: "",
    descripcion: "",
    grupo: "",
};

export const validadoresGrupo = {
    id: (valor: string) => valor.trim() !== "",
    descripcion: (valor: string) => valor.trim() !== "",
};

export const validadoresRegla = {
    id: (valor: string) => valor.trim() !== "",
    descripcion: (valor: string) => valor.trim() !== "",
    grupo: (valor: string) => valor.trim() !== "",
};
