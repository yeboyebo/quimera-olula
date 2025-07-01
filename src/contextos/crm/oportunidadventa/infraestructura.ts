import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery, criteriaQueryUrl } from "../../comun/infraestructura.ts";
import { Presupuesto } from "../../ventas/presupuesto/diseño.ts";
import { Accion } from "../accion/diseño.ts";
import { EstadoOportunidad, NuevaOportunidadVenta, OportunidadVenta } from "./diseño.ts";

const baseUrlOportunidadVenta = `/crm/oportunidad_venta`;
const baseUrlEstadoOportunidadVenta = `/crm/estado_oportunidad_venta`;
const baseUrlAccion = `/crm/accion`;
const baseUrlPresupuesto = `/ventas/presupuesto`;

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
    await RestAPI.patch(`${baseUrlOportunidadVenta}/${id}`, oportunidad);
};

export const deleteOportunidadVenta = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlOportunidadVenta}/${id}`);

export const getEstadosOportunidadVenta = async (filtro: Filtro, orden: Orden): Promise<EstadoOportunidad[]> => {
    const q = criteriaQuery(filtro, orden);
    return RestAPI.get<{ datos: EstadoOportunidad[] }>(baseUrlEstadoOportunidadVenta + q).then((respuesta) => respuesta.datos);
}


export const getAccionesOportunidad = async (oportunidadId: string) => {
    const filtro = ['oportunidad_id', oportunidadId] as unknown as Filtro;

    const orden = [] as Orden;

    const q = criteriaQueryUrl(filtro, orden);
    return RestAPI.get<{ datos: Accion[] }>(baseUrlAccion + q).then((respuesta) => respuesta.datos);
};

export const getPresupuestosOportunidad = async (oportunidadId: string) => {
    const filtro = ['oportunidad_id', oportunidadId] as unknown as Filtro;

    const orden = [] as Orden;

    const q = criteriaQueryUrl(filtro, orden);
    return RestAPI.get<{ datos: Presupuesto[] }>(baseUrlPresupuesto + q).then((respuesta) => respuesta.datos);
};

