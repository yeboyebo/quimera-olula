import { ClausulaFiltro } from "@olula/lib/diseño.ts";

export type EstadoCargaWidget = "cargando" | "listo";


export const fechaLocalStr = (fecha: Date): string => {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, "0");
    const d = String(fecha.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

export const construirUrlConFiltro = (
    ruta: string,
    filtro: ClausulaFiltro[]
): string => {
    const params = new URLSearchParams();

    for (const [campo, operador, valor] of filtro) {
        params.append(
            campo,
            valor === undefined ? operador : `${operador}__${valor}`
        );
    }

    const query = params.toString();
    return query ? `${ruta}?${query}` : ruta;
};