import { RestAPI } from "../../comun/api/rest_api.ts";
import ApiUrls from "../../comun/api/urls.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery, criteriaQueryUrl } from "../../comun/infraestructura.ts";
import { Accion } from "../accion/diseño.ts";
import { DeleteIncidencia, GetIncidencia, GetIncidencias, Incidencia, IncidenciaAPI, PatchIncidencia, PostIncidencia } from "./diseño.ts";

const baseUrlIncidencia = ApiUrls.CRM.INCIDENCIA;
const baseUrlAccion = ApiUrls.CRM.ACCION;

export const incidenciaFromApi = (incidenciaApi: IncidenciaAPI): Incidencia => {

    const incidencia = {
        ...incidenciaApi,
        // fecha: new Date(incidenciaApi.fecha),
    }
    return incidencia;
};

export const incidenciaToApi = (incidencia: Incidencia): IncidenciaAPI => {

    const incidenciaApi = {
        ...incidencia,
        // fecha: incidencia.fecha.toISOString(),
    };
    return incidenciaApi;
};

export const getIncidencia: GetIncidencia = async (id) =>
    await RestAPI.get<{ datos: IncidenciaAPI }>(`${baseUrlIncidencia}/${id}`).then((respuesta) =>
        incidenciaFromApi(respuesta.datos)
    );


export const getIncidencias: GetIncidencias = async (
    filtro, orden, paginacion
) => {

    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<{ datos: IncidenciaAPI[]; total: number }>(baseUrlIncidencia + q);

    return { datos: respuesta.datos.map(incidenciaFromApi), total: respuesta.total };
};

export const postIncidencia: PostIncidencia = async (incidencia) => {
    return await RestAPI.post(baseUrlIncidencia, incidencia, "Error al guardar Incidencia").then(
        (respuesta) => respuesta.id
    );
};

export const patchIncidencia: PatchIncidencia = async (id, incidencia) => {

    const apiIncidencia = incidenciaToApi(incidencia as Incidencia);
    const IncidenciaSinNulls = Object.fromEntries(
        Object.entries(apiIncidencia).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${baseUrlIncidencia}/${id}`, IncidenciaSinNulls, "Error al guardar Incidencia");
};

export const deleteIncidencia: DeleteIncidencia = async (id) => {
    await RestAPI.delete(`${baseUrlIncidencia}/${id}`, "Error al borrar Incidencia");
}

export const getAccionesIncidencia = async (incidenciaId: string) => {

    const filtro: Filtro = [['incidencia_id', incidenciaId]]
    const orden: Orden = [];
    const q = criteriaQueryUrl(filtro, orden);

    return RestAPI.get<{ datos: Accion[] }>(baseUrlAccion + q).then((respuesta) => respuesta.datos);
};

