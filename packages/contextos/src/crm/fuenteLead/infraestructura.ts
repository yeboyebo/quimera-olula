import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { FuenteLead } from "./diseño.ts";

const baseUrlFuenteLead = `/crm/fuente_lead`;

export interface FuenteLeadAPI {
    id: string;
    descripcion: string;
    valor_defecto: boolean;
}

export const fuenteLeadDesdeAPI = (api: FuenteLeadAPI): FuenteLead => ({
    id: api.id,
    descripcion: api.descripcion,
    valorDefecto: api.valor_defecto,
});

// El endpoint de escritura espera la clave "valordefecto" (sin guion bajo),
// distinta de "valor_defecto" que devuelve la lectura.
export const fuenteLeadToAPI = (f: FuenteLead) => {
    const { valorDefecto, ...rest } = f;
    return {
        ...rest,
        valordefecto: valorDefecto,
    };
};

export const getFuenteLead = async (id: string): Promise<FuenteLead> =>
    await RestAPI.get<{ datos: FuenteLeadAPI }>(`${baseUrlFuenteLead}/${id}`).then((respuesta) => fuenteLeadDesdeAPI(respuesta.datos));


export const getFuentesLead = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<FuenteLead> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: FuenteLeadAPI[]; total: number }>(baseUrlFuenteLead + q);
    return { datos: respuesta.datos.map(fuenteLeadDesdeAPI), total: respuesta.total };
};

export const postFuenteLead = async (fuente: FuenteLead): Promise<string> => {
    const payload = fuenteLeadToAPI(fuente);
    return await RestAPI.post(baseUrlFuenteLead, payload, "Error al guardar la fuente de lead").then((respuesta) => respuesta.id);
};

export const patchFuenteLead = async (id: string, fuente: Partial<FuenteLead>): Promise<void> => {
    const payload = fuenteLeadToAPI(fuente as FuenteLead);
    await RestAPI.patch(`${baseUrlFuenteLead}/${id}`, payload, "Error al guardar la fuente de lead");
};

export const deleteFuenteLead = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlFuenteLead}/${id}`, "Error al borrar la fuente de lead");

export const marcarPorDefectoFuenteLead = async (id: string): Promise<void> => await RestAPI.patch(`${baseUrlFuenteLead}/${id}/pordefecto`, {}, "Error al marcar por defecto la fuente de lead");
