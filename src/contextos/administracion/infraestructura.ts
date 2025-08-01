import { RespuestaLista } from "../comun/diseño.ts";
import { grupos, permisos, rules } from "./datos.tsx";
import { Grupo, Regla } from "./diseño.ts";

export const getGrupos = async (): RespuestaLista<Grupo> => {
    return { datos: grupos, total: 1 };
};

export const getReglas = async (): Promise<Regla[]> => {
    return rules;
};

export const getPermisos = async () => {
    return permisos;
};
