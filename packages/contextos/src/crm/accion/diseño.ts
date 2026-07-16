import { Entidad } from "@olula/lib/diseño.ts";

export interface ContactoAccion {
    nombre: string;
    cargo?: string | null;
    email?: string | null;
    telefono?: string | null;
}

export interface ClienteAccion {
    cliente_id: string | null;
    tarjeta_id: string | null;
    nombre: string;
    email?: string | null;
    telefono?: string | null;
    contactos?: ContactoAccion[];
}

export interface Accion extends Entidad {
    id: string;
    fecha: Date | null;
    fecha_fin?: Date | null;
    descripcion: string;
    estado: string;
    observaciones: string;
    agente_id: string;
    tipo: string;
    cliente_id: string;
    nombre_cliente?: string;
    contacto_id: string;
    nombre_contacto?: string;
    oportunidad_id: string;
    descripcion_oportunidad?: string;
    tarjeta_id: string;
    incidencia_id: string;
    usuario_id: string;
    cliente?: ClienteAccion | null;
}