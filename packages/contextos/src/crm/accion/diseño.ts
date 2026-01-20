import { Entidad } from "@olula/lib/diseño.ts";

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
    responsable_id: string;
}