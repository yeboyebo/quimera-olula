import { Entidad } from "../../../contextos/comun/diseño.ts";

type ValorFiltro = { like: string };
export type Filtro = { [campo: string]: ValorFiltro } | null;

export const filtrarEntidad = (
    entidad: Entidad,
    conjuntoFiltros: Filtro
): boolean => {
    if (!conjuntoFiltros) return true;

    return Object.entries(conjuntoFiltros).every(([campo, valor]) => {
        const claves = campo.split(".");

        const valorCampo = (
            claves.reduce(
                (objeto, clave) => objeto[clave] as Entidad,
                entidad
            ) as unknown as string
        ).toLowerCase();

        return valorCampo.includes(valor.like.toLowerCase());
    });
};