import { RestAPI } from "../../comun/api/rest_api.ts";
import ApiUrls from "../../comun/api/urls.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "../../comun/diseño.ts";
import { criteriaQuery, criteriaQueryUrl } from "../../comun/infraestructura.ts";
import { NuevoPresupuesto, Presupuesto } from "../../ventas/presupuesto/diseño.ts";
import { Accion } from "../accion/diseño.ts";
import { EstadoOportunidad, NuevaOportunidadVenta, OportunidadVenta } from "./diseño.ts";

export const getOportunidadVenta = async (id: string): Promise<OportunidadVenta> =>
    await RestAPI.get<{ datos: OportunidadVenta }>(`${ApiUrls.CRM.OPORTUNIDAD_VENTA}/${id}`).then((respuesta) => respuesta.datos);

export const getOportunidadesVenta = async (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
): RespuestaLista<OportunidadVenta> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: OportunidadVenta[]; total: number }>(ApiUrls.CRM.OPORTUNIDAD_VENTA + q);
    return { datos: respuesta.datos, total: respuesta.total };
};

export const postOportunidadVenta = async (oportunidad: NuevaOportunidadVenta): Promise<string> => {
    return await RestAPI.post(ApiUrls.CRM.OPORTUNIDAD_VENTA, oportunidad, "Error al guardar oportunidad de venta").then((respuesta) => respuesta.id);
};

export const patchOportunidadVenta = async (id: string, oportunidad: Partial<OportunidadVenta>): Promise<void> => {
    await RestAPI.patch(`${ApiUrls.CRM.OPORTUNIDAD_VENTA}/${id}`, oportunidad, "Error al guardar oportunidad de venta");
};

export const deleteOportunidadVenta = async (id: string): Promise<void> =>
    await RestAPI.delete(`${ApiUrls.CRM.OPORTUNIDAD_VENTA}/${id}`, "Error al borrar oportunidad de venta");

export const getEstadosOportunidadVenta = async (filtro: Filtro, orden: Orden): Promise<EstadoOportunidad[]> => {
    const q = criteriaQuery(filtro, orden);
    return RestAPI.get<{ datos: EstadoOportunidad[] }>(ApiUrls.CRM.ESTADO_OPORTUNIDAD + q).then((respuesta) => respuesta.datos);
}

export const getAccionesOportunidad = async (oportunidadId: string): Promise<Accion[]> => {
    const filtro = ['oportunidad_id', oportunidadId] as unknown as Filtro;
    const orden = [] as Orden;

    const q = criteriaQueryUrl(filtro, orden);
    return RestAPI.get<{ datos: Accion[] }>(ApiUrls.CRM.ACCION + q).then((respuesta) => respuesta.datos);
};

export const getPresupuestosOportunidad = async (oportunidadId: string): Promise<Presupuesto[]> => {
    const filtro = ['oportunidad_id', oportunidadId] as unknown as Filtro;
    const orden = [] as Orden;

    const q = criteriaQueryUrl(filtro, orden);
    return RestAPI.get<{ datos: Presupuesto[] }>(ApiUrls.VENTAS.PRESUPUESTO + q).then((respuesta) => respuesta.datos);
};

export const crearPresupuestoOportunidad = async (oportunidadId: string, cliente_id: string): Promise<string> => {
    const nuevoPresupuesto: Partial<NuevoPresupuesto> = {
        cliente_id: oportunidadId,
        direccion_id: cliente_id,
        empresa_id: "1",
    };

    return await RestAPI.post(ApiUrls.VENTAS.PRESUPUESTO, nuevoPresupuesto, "Error al crear presupuesto").then((respuesta) => respuesta.id);
}