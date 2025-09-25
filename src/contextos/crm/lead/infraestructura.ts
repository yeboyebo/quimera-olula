import { RestAPI } from "../../comun/api/rest_api.ts";
import ApiUrls from "../../comun/api/urls.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "../../comun/diseño.ts";
import { criteriaQuery, criteriaQueryUrl } from "../../comun/infraestructura.ts";
import { Accion } from "../accion/diseño.ts";
import { OportunidadVenta } from "../oportunidadventa/diseño.ts";
import { Lead, LeadAPI } from "./diseño.ts";

export const leadFromAPI = (l: LeadAPI): Lead => ({
    ...l,
    direccion: l.direccion?.direccion ?? "",
    cod_postal: l.direccion?.cod_postal ?? null,
    ciudad: l.direccion?.ciudad ?? "",
    provincia_id: l.direccion?.provincia_id ?? "",
    provincia: l.direccion?.provincia ?? "",
    pais_id: l.direccion?.pais_id ?? "",
    pais: l.direccion?.pais ?? null,
    telefono_1: l.direccion?.telefono_1 ?? "",
    telefono_2: l.direccion?.telefono_2 ?? "",
});

export const leadToAPI = (l: Lead): LeadAPI => {
    const {
        direccion,
        cod_postal,
        ciudad,
        provincia_id,
        provincia,
        pais_id,
        pais,
        telefono_1,
        telefono_2,
        ...rest
    } = l;
    return {
        ...rest,
        proveedor_id: (rest.proveedor_id ?? "") as string,
        direccion: {
            direccion: direccion ?? "",
            cod_postal: cod_postal ?? "",
            ciudad: ciudad ?? "",
            provincia_id: provincia_id ?? "",
            provincia: provincia ?? "",
            pais_id: pais_id ?? "",
            pais: pais ?? "",
            telefono_1: telefono_1 ?? "",
            telefono_2: telefono_2 ?? "",
        },
    };
};

export const getLead = async (id: string): Promise<Lead> =>
    await RestAPI.get<{ datos: LeadAPI }>(`${ApiUrls.CRM.LEAD}/${id}`).then((respuesta) =>
        leadFromAPI(respuesta.datos)
    );

export const getLeads = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<Lead> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: LeadAPI[]; total: number }>(ApiUrls.CRM.LEAD + q);
    return { datos: respuesta.datos.map(leadFromAPI), total: respuesta.total };
};

export const postLead = async (lead: Partial<Lead>): Promise<string> => {
    return await RestAPI.post(ApiUrls.CRM.LEAD, lead, "Error al guardar lead").then(
        (respuesta) => respuesta.id
    );
};

export const patchLead = async (id: string, lead: Partial<Lead>): Promise<void> => {
    const apiLead = leadToAPI(lead as Lead);
    // Convierte nulls a ""
    const leadSinNulls = Object.fromEntries(
        Object.entries(apiLead).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${ApiUrls.CRM.LEAD}/${id}`, leadSinNulls, "Error al guardar lead");
};

export const deleteLead = async (id: string): Promise<void> =>
    await RestAPI.delete(`${ApiUrls.CRM.LEAD}/${id}`, "Error al borrar lead");

export const getOportunidadesVentaLead = async (leadId: string): Promise<OportunidadVenta[]> => {
    const filtro = ['tarjeta_id', leadId] as unknown as Filtro;
    const orden = [] as Orden;

    const q = criteriaQueryUrl(filtro, orden);
    return RestAPI.get<{ datos: OportunidadVenta[] }>(ApiUrls.CRM.OPORTUNIDAD_VENTA + q).then((respuesta) => respuesta.datos);
};

export const getAccionesLead = async (leadId: string): Promise<Accion[]> => {
    const filtro = ['tarjeta_id', leadId] as unknown as Filtro;
    const orden = [] as Orden;

    const q = criteriaQueryUrl(filtro, orden);
    return RestAPI.get<{ datos: Accion[] }>(ApiUrls.CRM.ACCION + q).then((respuesta) => respuesta.datos);
};

export const getFuentesLead = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<Lead> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: LeadAPI[]; total: number }>(ApiUrls.CRM.FUENTE_LEAD + q);
    return { datos: respuesta.datos.map(leadFromAPI), total: respuesta.total };
};

export const getEstadosLead = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<Lead> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: LeadAPI[]; total: number }>(ApiUrls.CRM.ESTADO_LEAD + q);
    return { datos: respuesta.datos.map(leadFromAPI), total: respuesta.total };
};