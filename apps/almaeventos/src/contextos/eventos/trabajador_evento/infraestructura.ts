import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { NuevoTrabajadorEvento, TrabajadorEvento } from "./diseño.ts";

const baseUrlTrabajadorEvento = `/eventos/trabajador_evento`;

type TrabajadorEventoAPI = Omit<TrabajadorEvento, 'fecha'> & {
    fecha: string | null;
};

export const trabajadorEventoDesdeAPI = (v: TrabajadorEventoAPI): TrabajadorEvento => ({
    ...v,
    fecha: v.fecha ? new Date(Date.parse(v.fecha)) : null,
});

export const trabajadorEventoToAPI = (e: TrabajadorEvento) => ({
    ...e,
    valordefecto: e.valor_defecto,
    fecha: e.fecha instanceof Date ? e.fecha.toISOString().split('T')[0] : e.fecha,
});

export const getTrabajadorEvento = async (id: string): Promise<TrabajadorEvento> =>
    await RestAPI.get<{ datos: TrabajadorEventoAPI }>(`${baseUrlTrabajadorEvento}/${id}`).then((respuesta) => trabajadorEventoDesdeAPI(respuesta.datos));

export const getTrabajadoresEvento = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<TrabajadorEvento> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: TrabajadorEventoAPI[]; total: number }>(baseUrlTrabajadorEvento + q);
    return { datos: respuesta.datos.map(trabajadorEventoDesdeAPI), total: respuesta.total };
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