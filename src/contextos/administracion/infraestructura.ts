import { RestAPI } from "../comun/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "../comun/diseño.ts";
import { criteriaQuery } from "../comun/infraestructura.ts";
import { Grupo, Permiso, Regla } from "./diseño.ts";

const baseUrl = `/auth`;

// export const getGrupos = async (): RespuestaLista<Grupo> => {
//     return { datos: grupos, total: 1 };
// };

export const getGrupos = async (
    filtro?: Filtro,
    orden?: Orden,
    paginacion?: Paginacion
): RespuestaLista<Grupo> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    return await RestAPI.get<{ datos: Grupo[]; total: number }>(baseUrl + '/grupo' + q);
};

// export const getReglas = async (): Promise<Regla[]> => {
//     return rules;
// };

export const getReglas = async (
    filtro?: Filtro,
    orden?: Orden,
    paginacion?: Paginacion
): RespuestaLista<Regla> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    return await RestAPI.get<{ datos: Regla[]; total: number }>(baseUrl + '/regla' + q);
};

// export const getPermisos = async () => {
//     return permisos;
// };

export const getPermisos = async (
    filtro?: Filtro,
    orden?: Orden,
    paginacion?: Paginacion
): RespuestaLista<Permiso> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    return await RestAPI.get<{ datos: Permiso[]; total: number }>(baseUrl + '/permiso' + q);
};

export const putPermiso = async (grupo: string, regla: string, valor: boolean): Promise<void> => {
    await RestAPI.put(baseUrl + '/permiso', { grupo, regla, valor }, "Error al guardar persmiso");
};
