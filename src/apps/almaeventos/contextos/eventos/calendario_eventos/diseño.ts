import { Entidad } from "../../../../../contextos/comun/diseño.ts";

// Versión simplificada del evento para el calendario
export interface EventoCalendario extends Entidad {
    evento_id: string;
    id: string; // Alias para evento_id para compatibilidad
    fecha_inicio: string | null;
    descripcion: string | null;
    hora_inicio: string | null;
    lugar: string | null;
    estado_id: string | null;
}