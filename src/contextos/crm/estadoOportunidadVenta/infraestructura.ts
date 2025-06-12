import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { EstadoOportunidad } from "./diseño.ts";

const baseUrlEstadoOportunidadVenta = `/crm/estado_oportunidad_venta`;

// Convierte EstadoOportunidad a formato API (valor_defecto -> valordefecto)
export const estadoOportunidadToAPI = (e: EstadoOportunidad) => ({
    ...e,
    valordefecto: e.valor_defecto,
});

export const getEstadoOportunidad = async (id: string): Promise<EstadoOportunidad> =>
    await RestAPI.get<{ datos: EstadoOportunidad }>(`${baseUrlEstadoOportunidadVenta}/${id}`).then((respuesta) => respuesta.datos);

export const getEstadosOportunidad = async (filtro: Filtro = [], orden: Orden = []): Promise<EstadoOportunidad[]> => {
    const q = criteriaQuery(filtro, orden);
    return RestAPI.get<{ datos: EstadoOportunidad[] }>(baseUrlEstadoOportunidadVenta + q).then((respuesta) => respuesta.datos);
};

export const postEstadoOportunidad = async (estado: EstadoOportunidad): Promise<string> => {
    const payload = estadoOportunidadToAPI(estado);
    return await RestAPI.post(baseUrlEstadoOportunidadVenta, payload).then((respuesta) => respuesta.id);
};

export const patchEstadoOportunidad = async (id: string, estado: Partial<EstadoOportunidad>): Promise<void> => {
    const payload = estadoOportunidadToAPI(estado as EstadoOportunidad);
    await RestAPI.patch(`${baseUrlEstadoOportunidadVenta}/${id}`, { cambios: payload });
};

export const deleteEstadoOportunidad = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlEstadoOportunidadVenta}/${id}`);