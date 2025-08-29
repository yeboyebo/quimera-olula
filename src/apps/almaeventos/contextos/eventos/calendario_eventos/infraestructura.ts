import { RestAPI } from "../../../../../contextos/comun/api/rest_api.ts";
import { Filtro, Orden } from "../../../../../contextos/comun/diseño.ts";
import { criteriaQuery } from "../../../../../contextos/comun/infraestructura.ts";
import { EventoCalendario } from "./diseño.ts";

const baseUrlEvento = `/eventos/evento`;

// Obtener eventos simplificados para el calendario
export const getEventosCalendario = async (
    filtro: Filtro = [],
    orden: Orden = ["finicio", "ASC"],
    fechaInicio?: string,
    fechaFin?: string
): Promise<EventoCalendario[]> => {
    // Añadir filtros de fecha si se proporcionan
    let filtroConFechas = [...filtro];

    if (fechaInicio) {
        filtroConFechas.push(["finicio", ">=", fechaInicio]);
    }

    if (fechaFin) {
        filtroConFechas.push(["finicio", "<=", fechaFin]);
    }

    const q = criteriaQuery(filtroConFechas, orden);
    return RestAPI.get<{ datos: EventoCalendario[] }>(baseUrlEvento + q).then((respuesta) =>
        respuesta.datos.map(evento => ({
            ...evento,
            id: evento.evento_id, // Asegurar compatibilidad
            fecha: evento.fecha_inicio
        }))
    );
};