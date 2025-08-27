import { Entidad } from "../../comun/diseño.ts";

export interface Accion extends Entidad {
    id: string;
    fecha: string;
    descripcion: string;
    estado: string;
    observaciones: string;
    tipo: string;
    cliente_id: string;
    nombre_cliente?: string;
    contacto_id: string;
    oportunidad_id: string;
    descripcion_oportunidad?: string;
    tarjeta_id: string;
    incidencia_id: string;
    usuario_id: string;
}

export type NuevaAccion = {
    fecha: string;
    descripcion: string;
    tipo: string;
    estado: "Pendiente" | "En Progreso" | "Completada" | "Cancelada";
    observaciones: string;
    incidencia_id: string;
    tarjeta_id: string;
    usuario_id: string;
    oportunidad_id: string;
    contacto_id: string;
};