import { OpcionCampo } from "../../componentes/detalle/FormularioGenerico.tsx";
import { RestAPI } from "./api/rest_api.ts";
import { CriteriaAPI, Filtro, FiltroAPI, Orden, OrdenAPI } from "./diseño.ts";

export const criteriaQuery = (filtro?: Filtro, orden?: Orden): string => {
    if (!filtro && !orden) {
        return "";
    }
    console.log("criteriaQuery", filtro, orden);

    const criteria = transformarCriteria(filtro, orden);
    return `?q=${JSON.stringify(criteria)}`;
}

export const transformarCriteria = (filtro?: Filtro, orden?: Orden): CriteriaAPI => {
    const res: CriteriaAPI = {}
    if (filtro) {
        res['filtro'] = transformarFiltro(filtro);
    }
    if (orden) {
        res['orden'] = transformarOrden(orden);
    }
    return res;
}

const transformarFiltro = (filtro: Filtro): FiltroAPI => {
    return Object.entries(filtro).map(([campo, valor]) => [campo, '~', valor['LIKE']]);
}

const transformarOrden = (orden: Orden): OrdenAPI => {
    return Object.entries(orden).map(([campo, orden]) => [campo, orden]).flat();
}

export const obtenerOpcionesSelector =
    (path: string) => async () =>
        RestAPI.get<{ datos: [] }>(
            `/cache/comun/${path}`
        ).then((respuesta) => respuesta.datos.map(({ descripcion, ...resto }: Record<string, string>) => [Object.values(resto).at(0), descripcion] as OpcionCampo));
