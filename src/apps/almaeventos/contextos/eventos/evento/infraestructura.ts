import { RestAPI } from "../../../../../contextos/comun/api/rest_api.ts";
import { Filtro, Orden } from "../../../../../contextos/comun/diseño.ts";
import { criteriaQuery } from "../../../../../contextos/comun/infraestructura.ts";
import { Evento, NuevoEvento } from "./diseño.ts";

const baseUrlEvento = `/eventos/evento`;

export const eventoToAPI = (e: Evento) => ({
    ...e,
    valordefecto: e.valor_defecto,
});

export const getEvento = async (id: string): Promise<Evento> =>
    await RestAPI.get<{ datos: Evento }>(`${baseUrlEvento}/${id}`).then((respuesta) => respuesta.datos);

export const getEventos = async (_filtro: Filtro, _orden: Orden): Promise<Evento[]> => {
    const q = criteriaQuery(_filtro, _orden);
    return RestAPI.get<{ datos: Evento[] }>(baseUrlEvento + q).then((respuesta) => respuesta.datos);
};

export const postEvento = async (_evento: NuevoEvento): Promise<string> => {
    return await RestAPI.post(baseUrlEvento, _evento).then((respuesta) => respuesta.id);
};

export const patchEvento = async (id: string, estado: Partial<Evento>): Promise<void> => {
    const payload = eventoToAPI(estado as Evento);
    console.log('mimensaje_patchEvento', payload);
    await RestAPI.patch(`${baseUrlEvento}/${id}`, { cambios: payload });
};

export const deleteEvento = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlEvento}/${id}`);
