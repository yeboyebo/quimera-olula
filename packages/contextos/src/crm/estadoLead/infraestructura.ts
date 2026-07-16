import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { EstadoLead } from "./diseño.ts";

const baseUrlEstadoLead = `/crm/estado_lead`;

export interface EstadoLeadAPI {
    id: string;
    descripcion: string;
    valor_defecto: boolean;
}

export const estadoLeadDesdeAPI = (api: EstadoLeadAPI): EstadoLead => ({
    id: api.id,
    descripcion: api.descripcion,
    valorDefecto: api.valor_defecto,
});

// El endpoint de escritura espera la clave "valordefecto" (sin guion bajo),
// distinta de "valor_defecto" que devuelve la lectura.
export const estadoLeadToAPI = (e: EstadoLead) => {
    const { valorDefecto, ...rest } = e;
    return {
        ...rest,
        valordefecto: valorDefecto,
    };
};

export const getEstadoLead = async (id: string): Promise<EstadoLead> =>
    await RestAPI.get<{ datos: EstadoLeadAPI }>(`${baseUrlEstadoLead}/${id}`).then((respuesta) => estadoLeadDesdeAPI(respuesta.datos));


export const getEstadosLead = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<EstadoLead> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: EstadoLeadAPI[]; total: number }>(baseUrlEstadoLead + q);
    return { datos: respuesta.datos.map(estadoLeadDesdeAPI), total: respuesta.total };
};

export const postEstadoLead = async (estado: EstadoLead): Promise<string> => {
    const payload = estadoLeadToAPI(estado);
    return await RestAPI.post(baseUrlEstadoLead, payload, "Error al guardar el estado de lead").then((respuesta) => respuesta.id);
};

export const patchEstadoLead = async (id: string, estado: Partial<EstadoLead>): Promise<void> => {
    const payload = estadoLeadToAPI(estado as EstadoLead);
    await RestAPI.patch(`${baseUrlEstadoLead}/${id}`, payload, "Error al guardar el estado de lead");
};

export const deleteEstadoLead = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlEstadoLead}/${id}`, "Error al borrar el estado de lead");

export const marcarPorDefectoEstadoLead = async (id: string): Promise<void> => await RestAPI.patch(`${baseUrlEstadoLead}/${id}/pordefecto`, {}, "Error al marcar por defecto el estado de lead");
