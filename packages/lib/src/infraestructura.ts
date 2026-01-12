import { RestAPI } from "./api/rest_api.ts";
import { Criteria, Filtro, OpcionCampo, Orden, Paginacion } from "./diseño.ts";

export const criteriaAQueryString = (criteria: Criteria): string => {
    return criteriaQuery(criteria.filtro, criteria.orden, criteria.paginacion);
}

export const criteriaQuery = (filtro?: Filtro, orden?: Orden, paginacion?: Paginacion): string => {
    if (!filtro && !orden) {
        return "";
    }

    const criteria = transformarCriteria(filtro, orden, paginacion);
    return aplicarCriteriaUrl(criteria);
}

export const criteriaQueryUrl = (filtro?: Filtro, orden?: Orden): string => {
    if (!filtro && !orden) {
        return "";
    }

    const criteria = transformarCriteria(filtro, orden);
    return aplicarCriteriaUrl(criteria);
}

export const aplicarCriteriaUrl = (criteria: Criteria): string => {
    return `?q=${JSON.stringify(criteria)}`;
}

export const transformarCriteria = (filtro?: Filtro, orden?: Orden, paginacion?: Paginacion): Criteria => {
    const res: Partial<Criteria> = {};
    if (filtro) {
        // res['filtro'] = transformarFiltro(filtro);
        res['filtro'] = filtro;
    }
    if (orden) {
        // res['orden'] = transformarOrden(orden);
        res['orden'] = orden;
    }
    if (paginacion) {
        res['paginacion'] = paginacion;
    }
    return res as Criteria;
}

// const transformarFiltro = (filtro: Filtro): FiltroAPI => {
//     return Object.entries(filtro).map(([campo, valor]) => [campo, '~', valor['LIKE']]);
// }

// const transformarOrden = (orden: Orden): OrdenAPI => {
//     return Object.entries(orden).map(([campo, orden]) => [campo, orden]).flat();
// }

export const obtenerOpcionesSelector =
    (path: string) => async () =>
        RestAPI.get<{ datos: [] }>(
            `/cache/comun/${path}`
        ).then((respuesta) => respuesta.datos.map(({ descripcion, ...resto }: Record<string, string>) => [Object.values(resto).at(0), descripcion] as OpcionCampo));
