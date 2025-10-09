import { RestAPI } from "../../../../../contextos/comun/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "../../../../../contextos/comun/diseño.ts";
import { criteriaQuery } from "../../../../../contextos/comun/infraestructura.ts";
import { Evento, NuevoEvento } from "./diseño.ts";
import { reemplazarNulls } from "./dominio.ts";

const baseUrlEvento = `/eventos/evento`;

export const eventoToAPI = (e: Evento) => ({
    ...e,
    valordefecto: e.valor_defecto,
});

export const getEvento = async (evento_id: string): Promise<Evento> =>
    await RestAPI.get<{ datos: Evento }>(`${baseUrlEvento}/${evento_id}`).then((respuesta) => respuesta.datos);

export const getEventos = async (
    filtro: Filtro,
    orden: Orden = ["finicio", "DESC"],
    paginacion: Paginacion
): RespuestaLista<Evento> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    return await RestAPI.get<{ datos: Evento[]; total: number }>(baseUrlEvento + q);
};

export const postEvento = async (_evento: NuevoEvento): Promise<string> => {
    return await RestAPI.post(baseUrlEvento, _evento).then((respuesta) => respuesta.id);
};

export const patchEvento = async (evento_id: string, evento: Partial<Evento>): Promise<void> => {
    const eventoSinNulls = reemplazarNulls(evento);
    await RestAPI.patch(`${baseUrlEvento}/${evento_id}`, { cambios: eventoSinNulls });
};

export const deleteEvento = async (evento_id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlEvento}/${evento_id}`);

export const descargarHojaRuta = async (evento_id: string): Promise<Blob> => {
    const url = `${baseUrlEvento}/${evento_id}/hoja_ruta_evento`;
    return await RestAPI.blob(url);
};