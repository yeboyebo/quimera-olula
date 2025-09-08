import { RestAPI } from "../../comun/api/rest_api.ts";
import ApiUrls from "../../comun/api/urls.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Accion } from "./diseño.ts";

export const getAccion = async (id: string): Promise<Accion> =>
    await RestAPI.get<{ datos: Accion }>(`${ApiUrls.CRM.ACCION}/${id}`).then((respuesta) => respuesta.datos);

export const getAcciones = async (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
): RespuestaLista<Accion> => {
    const q = criteriaQuery(filtro, orden, paginacion);
    return await RestAPI.get<{ datos: Accion[]; total: number }>(ApiUrls.CRM.ACCION + q);
};

export const postAccion = async (accion: Partial<Accion>): Promise<string> => {
    return await RestAPI.post(ApiUrls.CRM.ACCION, accion, "Error al guardar acción").then((respuesta) => respuesta.id);
};

export const patchAccion = async (id: string, accion: Partial<Accion>): Promise<void> => {
    const accionSinNulls = Object.fromEntries(
        Object.entries(accion).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${ApiUrls.CRM.ACCION}/${id}`, accionSinNulls, "Error al guardar acción");
};

export const deleteAccion = async (id: string): Promise<void> =>
    await RestAPI.delete(`${ApiUrls.CRM.ACCION}/${id}`, "Error al borrar acción");

export const finalizarAccion = async (id: string): Promise<void> => {
    await RestAPI.patch(`${ApiUrls.CRM.ACCION}/${id}/finalizar`, {}, "Error al finalizar acción");
};