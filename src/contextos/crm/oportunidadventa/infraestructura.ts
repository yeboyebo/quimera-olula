import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { EstadoOportunidad, NuevaOportunidadVenta, OportunidadVenta } from "./diseño.ts";

const baseUrlOportunidadVenta = `/crm/oportunidad_venta`;
const baseUrlEstadoOportunidadVenta = `/crm/estado_oportunidad_venta`;

export const getOportunidadVenta = async (id: string): Promise<OportunidadVenta> =>
    await RestAPI.get<{ datos: OportunidadVenta }>(`${baseUrlOportunidadVenta}/${id}`).then((respuesta) => respuesta.datos);

export const getOportunidadesVenta = async (filtro: Filtro, orden: Orden): Promise<OportunidadVenta[]> => {
    const q = criteriaQuery(filtro, orden);
    return RestAPI.get<{ datos: OportunidadVenta[] }>(baseUrlOportunidadVenta + q).then((respuesta) => respuesta.datos);
};

export const postOportunidadVenta = async (oportunidad: NuevaOportunidadVenta): Promise<string> => {
    return await RestAPI.post(baseUrlOportunidadVenta, oportunidad).then((respuesta) => respuesta.id);
};

export const patchOportunidadVenta = async (id: string, oportunidad: Partial<OportunidadVenta>): Promise<void> => {
    await RestAPI.patch(`${baseUrlOportunidadVenta}/${id}`, { cambios: oportunidad });
};

export const deleteOportunidadVenta = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlOportunidadVenta}/${id}`);

export const getEstadosOportunidadVenta = async (
    filtro = {},
    orden = {}
): Promise<EstadoOportunidad[]> =>
    await RestAPI.get<{ datos: EstadoOportunidad[] }>(
        baseUrlEstadoOportunidadVenta + criteriaQuery(filtro, orden)
    ).then((respuesta) => respuesta.datos);
