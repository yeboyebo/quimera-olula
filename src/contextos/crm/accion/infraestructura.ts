import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Accion } from "./diseño.ts";

const baseUrlAccion = `/crm/accion`;

export const getAccion = async (id: string): Promise<Accion> =>
    await RestAPI.get<{ datos: Accion }>(`${baseUrlAccion}/${id}`).then((respuesta) => respuesta.datos);

export const getAcciones = async (filtro: Filtro, orden: Orden): Promise<Accion[]> => {
    const q = criteriaQuery(filtro, orden);
    return RestAPI.get<{ datos: Accion[] }>(baseUrlAccion + q).then((respuesta) => respuesta.datos);
};

export const postAccion = async (accion: Partial<Accion>): Promise<string> => {
    return await RestAPI.post(baseUrlAccion, accion).then((respuesta) => respuesta.id);
};

export const patchAccion = async (id: string, accion: Partial<Accion>): Promise<void> => {
    // Quitar es para probar
    const accionSinNulls = Object.fromEntries(
        Object.entries(accion).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${baseUrlAccion}/${id}`, accionSinNulls);
};

export const deleteAccion = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlAccion}/${id}`);

