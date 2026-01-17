import ApiUrls from "#/tpv/comun/urls.ts";
import { RestAPI } from "@olula/lib/api/rest_api.js";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaAQueryString } from "@olula/lib/infraestructura.js";
import { AgenteTpv, GetAgentesTpv } from "./diseño.ts";

type AgenteTpvAPI = {
    id: string;
    nombre: string;
}

const baseUrl = new ApiUrls().AGENTE;

export const agenteDesdeAPI = (a: AgenteTpvAPI): AgenteTpv => ({
    id: a.id,
    nombre: a.nombre
});

export const getAgentesTpv: GetAgentesTpv = async (
    criteria: Criteria,
) => {
    const url = `${baseUrl}` + criteriaAQueryString(criteria);
    // const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: AgenteTpvAPI[]; total: number }>(url);
    return { datos: respuesta.datos.map(agenteDesdeAPI), total: respuesta.total };
};
