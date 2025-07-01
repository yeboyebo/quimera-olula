import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Lead } from "./diseño.ts";

const baseUrlLead = `/crm/lead`;

export const getLead = async (id: string): Promise<Lead> =>
    await RestAPI.get<{ datos: Lead }>(`${baseUrlLead}/${id}`).then((respuesta) => respuesta.datos);

export const getLeads = async (filtro: Filtro, orden: Orden): Promise<Lead[]> => {
    const q = criteriaQuery(filtro, orden);
    return RestAPI.get<{ datos: Lead[] }>(baseUrlLead + q).then((respuesta) => respuesta.datos);
};

export const postLead = async (lead: Partial<Lead>): Promise<string> => {
    return await RestAPI.post(baseUrlLead, lead).then((respuesta) => respuesta.id);
};

export const patchLead = async (id: string, lead: Partial<Lead>): Promise<void> => {
    const leadSinNulls = Object.fromEntries(
        Object.entries(lead).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${baseUrlLead}/${id}`, leadSinNulls);
};

export const deleteLead = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlLead}/${id}`);

