import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { NuevoEstadoOportunidad } from "./crear/diseño.ts";
import { EstadoOportunidad } from "./diseño.ts";

const baseUrlEstadoOportunidadVenta = `/crm/estado_oportunidad_venta`;

export interface EstadoOportunidadAPI {
    id: string;
    estadobase: string;
    descripcion: string;
    probabilidad: number;
    valor_defecto: boolean;
}

export const estadoOportunidadDesdeAPI = (api: EstadoOportunidadAPI): EstadoOportunidad => ({
    id: api.id,
    estadobase: api.estadobase,
    descripcion: api.descripcion,
    probabilidad: api.probabilidad,
    valorDefecto: api.valor_defecto,
});

// El endpoint de escritura espera la clave "valordefecto" (sin guion bajo),
// distinta de "valor_defecto" que devuelve la lectura.
export const estadoOportunidadToAPI = (e: NuevoEstadoOportunidad) => {
    const { valorDefecto, ...rest } = e;
    return {
        ...rest,
        valordefecto: valorDefecto,
    };
};

export const getEstadoOportunidad = async (id: string): Promise<EstadoOportunidad> =>
    await RestAPI.get<{ datos: EstadoOportunidadAPI }>(`${baseUrlEstadoOportunidadVenta}/${id}`).then((respuesta) => estadoOportunidadDesdeAPI(respuesta.datos));


export const getEstadosOportunidad = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<EstadoOportunidad> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: EstadoOportunidadAPI[]; total: number }>(baseUrlEstadoOportunidadVenta + q);
    return { datos: respuesta.datos.map(estadoOportunidadDesdeAPI), total: respuesta.total };
};

export const postEstadoOportunidad = async (estado: NuevoEstadoOportunidad): Promise<string> => {
    const payload = estadoOportunidadToAPI(estado);
    return await RestAPI.post(baseUrlEstadoOportunidadVenta, payload, "Error al guardar el estado de oportunidad de venta").then((respuesta) => respuesta.id);
};

export const patchEstadoOportunidad = async (id: string, estado: Partial<EstadoOportunidad>): Promise<void> => {
    const payload = estadoOportunidadToAPI(estado as EstadoOportunidad);
    await RestAPI.patch(`${baseUrlEstadoOportunidadVenta}/${id}`, payload, "Error al guardar el estado de oportunidad de venta");
};

export const deleteEstadoOportunidad = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlEstadoOportunidadVenta}/${id}`, "Error al borrar el estado de oportunidad de venta");

export const marcarPorDefectoEstadoOportunidad = async (id: string): Promise<void> => await RestAPI.patch(`${baseUrlEstadoOportunidadVenta}/${id}/pordefecto`, {}, "Error al marcar por defecto el estado de oportunidad de venta");
