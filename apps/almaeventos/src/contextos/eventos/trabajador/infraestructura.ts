import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { NuevoTrabajador, Trabajador } from "./diseño.ts";

const baseUrlTrabajador = `/eventos/trabajador`;

export const trabajadorToAPI = (e: Trabajador) => ({
    ...e,
    valordefecto: e.valor_defecto,
});

export const getTrabajador = async (id: string): Promise<Trabajador> =>
    await RestAPI.get<{ datos: Trabajador }>(`${baseUrlTrabajador}/${id}`).then((respuesta) => respuesta.datos);

export const getTrabajadores = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<Trabajador> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    return await RestAPI.get<{ datos: Trabajador[]; total: number }>(baseUrlTrabajador + q);
};

export const postTrabajador = async (_trabajador: NuevoTrabajador): Promise<string> => {
    return await RestAPI.post(baseUrlTrabajador, _trabajador).then((respuesta) => respuesta.id);
};

export const patchTrabajador = async (id: string, estado: Partial<Trabajador>): Promise<void> => {
    const payload = trabajadorToAPI(estado as Trabajador);
    await RestAPI.patch(`${baseUrlTrabajador}/${id}`, { cambios: payload });
};

export const deleteTrabajador = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlTrabajador}/${id}`);