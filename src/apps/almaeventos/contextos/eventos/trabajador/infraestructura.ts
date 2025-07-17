import { RestAPI } from "../../../../../contextos/comun/api/rest_api.ts";
import { Filtro, Orden } from "../../../../../contextos/comun/diseño.ts";
import { criteriaQuery } from "../../../../../contextos/comun/infraestructura.ts";
import { NuevoTrabajador, Trabajador } from "./diseño.ts";

const baseUrlTrabajador = `/eventos/trabajador`;

export const TrabajadorToAPI = (e: Trabajador) => ({
    ...e,
    valordefecto: e.valor_defecto,
});

export const getTrabajador = async (id: string): Promise<Trabajador> =>
    await RestAPI.get<{ datos: Trabajador }>(`${baseUrlTrabajador}/${id}`).then((respuesta) => respuesta.datos);

export const getTrabajadores = async (_filtro: Filtro, _orden: Orden): Promise<Trabajador[]> => {
    const q = criteriaQuery(_filtro, _orden);
    return RestAPI.get<{ datos: Trabajador[] }>(baseUrlTrabajador + q).then((respuesta) => respuesta.datos);
};

export const postTrabajador = async (_trabajador: NuevoTrabajador): Promise<string> => {
    return await RestAPI.post(baseUrlTrabajador, _trabajador).then((respuesta) => respuesta.id);
};

export const patchTrabajador = async (_id: string, _trabajador: Partial<Trabajador>): Promise<void> => { };

export const deleteTrabajador = async (_id: string): Promise<void> => { };