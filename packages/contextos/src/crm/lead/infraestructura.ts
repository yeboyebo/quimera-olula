import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery, criteriaQueryUrl } from "@olula/lib/infraestructura.ts";
import { Accion } from "../accion/diseño.ts";
import ApiUrls from "../comun/urls.ts";
import { OportunidadVenta } from "../oportunidadventa/diseño.ts";
import { Lead, LeadAPI, LeadToAPI } from "./diseño.ts";

export const leadFromAPI = (l: LeadAPI): Lead => ({
    ...l,
    direccion: l.direccion?.direccion ?? "",
    cod_postal: l.direccion?.cod_postal ?? null,
    ciudad: l.direccion?.ciudad ?? "",
    provincia_id: l.direccion?.provincia_id != null ? String(l.direccion.provincia_id) : null,
    provincia: l.direccion?.provincia ?? "",
    pais_id: l.direccion?.pais_id ?? "",
    pais: l.direccion?.pais ?? null,
    telefono_1: l.direccion?.telefono_1 ?? "",
    telefono_2: l.direccion?.telefono_2 ?? "",
});

export const leadToAPI = (l: Lead): LeadToAPI => {
    const {
        direccion,
        cod_postal,
        ciudad,
        provincia_id,
        provincia,
        pais_id,
        pais,
        telefono_1,
        ...rest
    } = l;
    return {
        ...rest,
        proveedor_id: (rest.proveedor_id ?? "") as string,
        direccion: {
            nombre_via: direccion ?? "",
            cod_postal: cod_postal ?? "",
            ciudad: ciudad ?? "",
            provincia_id: provincia_id ? String(provincia_id) : null,
            provincia: provincia ?? "",
            pais_id: pais_id ?? "",
            pais: pais ?? "",
            telefono: telefono_1 ?? "",
            tipo_via: "",
            numero: "",
            otros: "",
            apartado: "",
        },
    };
};

export const getLead = async (id: string): Promise<Lead> =>
    await RestAPI.get<{ datos: LeadAPI }>(`${new ApiUrls().LEAD}/${id}`).then((respuesta) =>
        leadFromAPI(respuesta.datos)
    );

export const getLeads = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<Lead> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: LeadAPI[]; total: number }>(new ApiUrls().LEAD + q);
    return { datos: respuesta.datos.map(leadFromAPI), total: respuesta.total };
};

export const postLead = async (lead: Partial<Lead>): Promise<string> => {
    return await RestAPI.post(new ApiUrls().LEAD, lead, "Error al guardar lead").then(
        (respuesta) => respuesta.id
    );
};

export const patchLead = async (id: string, lead: Partial<Lead>): Promise<void> => {
    const apiLead = leadToAPI(lead as Lead);
    await RestAPI.patch(`${new ApiUrls().LEAD}/${id}`, apiLead, "Error al guardar lead");
};

export const deleteLead = async (id: string): Promise<void> =>
    await RestAPI.delete(`${new ApiUrls().LEAD}/${id}`, "Error al borrar lead");

export const getOportunidadesVentaLead = async (leadId: string): RespuestaLista<OportunidadVenta> => {
    const filtro = ['tarjeta_id', leadId] as unknown as Filtro;
    const orden = [] as Orden;

    const q = criteriaQueryUrl(filtro, orden);
    return RestAPI.get<{ datos: OportunidadVenta[], total: number }>(new ApiUrls().OPORTUNIDAD_VENTA + q).then((respuesta) => respuesta);
};

export const getAccionesLead = async (leadId: string): RespuestaLista<Accion> => {
    const filtro = ['tarjeta_id', leadId] as unknown as Filtro;
    const orden = [] as Orden;

    const q = criteriaQueryUrl(filtro, orden);
    return RestAPI.get<{ datos: Accion[], total: number }>(new ApiUrls().ACCION + q).then((respuesta) => respuesta);
};

export const getFuentesLead = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<Lead> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: LeadAPI[]; total: number }>(new ApiUrls().FUENTE_LEAD + q);
    return { datos: respuesta.datos.map(leadFromAPI), total: respuesta.total };
};

export const getEstadosLead = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<Lead> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: LeadAPI[]; total: number }>(new ApiUrls().ESTADO_LEAD + q);
    return { datos: respuesta.datos.map(leadFromAPI), total: respuesta.total };
};