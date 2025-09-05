import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Accion } from "./diseño.ts";

const baseUrlAccion = `/crm/accion`;

export const getAccion = async (id: string): Promise<Accion> =>
    await RestAPI.get<{ datos: Accion }>(`${baseUrlAccion}/${id}`).then((respuesta) => respuesta.datos);

export const getAcciones = async (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
): RespuestaLista<Accion> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    return await RestAPI.get<{ datos: Accion[]; total: number }>(baseUrlAccion + q);
};

export const postAccion = async (accion: Partial<Accion>): Promise<string> => {
    return await RestAPI.post(baseUrlAccion, accion, "Error al guardar acción").then((respuesta) => respuesta.id);
};

export const patchAccion = async (id: string, accion: Partial<Accion>): Promise<void> => {
    // Quitar es para probar
    const accionSinNulls = Object.fromEntries(
        Object.entries(accion).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${baseUrlAccion}/${id}`, accionSinNulls, "Error al guardar acción");
};

export const deleteAccion = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlAccion}/${id}`, "Error al borrar acción");

export const finalizarAccion = async (id: string) => {
    await RestAPI.patch(`${baseUrlAccion}/${id}/finalizar`, {}, "Error al finalizar acción");
};