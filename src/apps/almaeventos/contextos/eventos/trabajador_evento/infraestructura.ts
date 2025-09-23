import { RestAPI } from "../../../../../contextos/comun/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "../../../../../contextos/comun/diseño.ts";
import { criteriaQuery } from "../../../../../contextos/comun/infraestructura.ts";
import { NuevoTrabajadorEvento, TrabajadorEvento } from "./diseño.ts";

const baseUrlTrabajadorEvento = `/eventos/trabajador_evento`;

export const trabajadorEventoToAPI = (e: TrabajadorEvento) => ({
    ...e,
    valordefecto: e.valor_defecto,
});

export const getTrabajadorEvento = async (id: string): Promise<TrabajadorEvento> =>
    await RestAPI.get<{ datos: TrabajadorEvento }>(`${baseUrlTrabajadorEvento}/${id}`).then((respuesta) => respuesta.datos);

export const getTrabajadoresEvento = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<TrabajadorEvento> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    return await RestAPI.get<{ datos: TrabajadorEvento[]; total: number }>(baseUrlTrabajadorEvento + q);
};

export const postTrabajadorEvento = async (_trabajadorEvento: NuevoTrabajadorEvento): Promise<string> => {
    return await RestAPI.post(baseUrlTrabajadorEvento, _trabajadorEvento).then((respuesta) => respuesta.id);
};

export const patchTrabajadorEvento = async (id: string, estado: Partial<TrabajadorEvento>): Promise<void> => {
    const payload = trabajadorEventoToAPI(estado as TrabajadorEvento);

    // Asegurarse de que id sea siempre un string
    if (payload.id !== undefined) {
        payload.id = String(payload.id);
    }

    await RestAPI.patch(`${baseUrlTrabajadorEvento}/${id}`, { cambios: payload });
};

export const deleteTrabajadorEvento = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlTrabajadorEvento}/${id}`);