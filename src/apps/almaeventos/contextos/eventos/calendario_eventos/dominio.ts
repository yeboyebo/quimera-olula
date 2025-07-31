import { EstadoModelo, initEstadoModelo } from "../../../../../contextos/comun/dominio.ts";
import { EventoCalendario } from "./diseño.ts";


export const initEstadoEventoCalendario = (evento: EventoCalendario): EstadoModelo<EventoCalendario> =>
    initEstadoModelo(evento);


// Obtener eventos para una fecha específica
export const getEventosPorFecha = (eventos: EventoCalendario[], fecha: Date): EventoCalendario[] => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return eventos.filter(evento => evento.fecha_inicio === fechaStr);
};
