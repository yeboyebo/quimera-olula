
import { grupos, rules } from "./datos.tsx";
import { Grupo, Regla } from "./diseño.ts";

export const getGrupos = async (): Promise<Grupo[]> => {
    return grupos;
};

export const getReglas = async (): Promise<Regla[]> => {
    return rules.filter(
        (regla: Regla) => !regla.id.includes("/")
    );
};
