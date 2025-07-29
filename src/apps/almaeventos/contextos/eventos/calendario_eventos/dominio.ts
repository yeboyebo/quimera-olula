import { EventoCalendario } from "./diseño.ts";

// Obtener eventos para una fecha específica
export const getEventosPorFecha = (eventos: EventoCalendario[], fecha: Date): EventoCalendario[] => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return eventos.filter(evento => evento.fecha_inicio === fechaStr);
};

// Generar días del mes para el calendario
export const getDiasDelMes = (fechaActual: Date) => {
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    
    // Días de la semana anterior para completar la primera semana
    const diasAnteriores = primerDia.getDay();
    const fechaInicio = new Date(primerDia);
    fechaInicio.setDate(fechaInicio.getDate() - diasAnteriores);
    
    const dias: Date[] = [];
    for (let i = 0; i < 42; i++) { // 6 semanas × 7 días
        const fecha = new Date(fechaInicio);
        fecha.setDate(fechaInicio.getDate() + i);
        dias.push(fecha);
    }
    
    return dias;
};

// Utilidades de fecha
export const esHoy = (fecha: Date): boolean => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
};

export const esMesActual = (fecha: Date, fechaActual: Date): boolean => {
    return fecha.getMonth() === fechaActual.getMonth();
};

export const formatearMesAño = (fecha: Date): string => {
    return fecha.toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric' 
    });
};