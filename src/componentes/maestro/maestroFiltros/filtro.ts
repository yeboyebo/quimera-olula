import { Entidad, Filtro } from "../../../contextos/comun/diseño.ts";

export const filtrarEntidad = (
    entidad: Entidad,
    conjuntoFiltros: Filtro
): boolean => {
    if (!conjuntoFiltros) return true;

    return conjuntoFiltros.every(([campo, operador, valor]) => {
        const claves = campo.split(".");

        const valorCampo = (
            claves.reduce(
                (objeto, clave) => objeto[clave] as Entidad,
                entidad
            ) as unknown as string
        )?.toLowerCase();

        if (operador === "~") {
            return valorCampo?.includes(valor.toLowerCase()) ?? false;
        }
        // Si en el futuro hay otros operadores, se pueden añadir aquí
        return true;
    });
};
