import { grupos, permisos, rules } from "./datos.tsx";
import { Grupo, Regla } from "./diseño.ts";

export const getGrupos = async (): Promise<Grupo[]> => {
    return grupos;
};

export const getReglas = async (): Promise<Regla[]> => {
    return rules;
};

export const getPermisos = async (idRegla: string) => {
    return permisos.filter((permiso) => permiso.idrule === idRegla);
};
