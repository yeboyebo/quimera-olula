import { Entidad } from "../../comun/diseño.ts";

export interface Accion extends Entidad {
    id: string;
    fecha: string;
    descripcion: string;
    estado: string;
    observaciones: string;
    agente_id: string;
    tipo: string;
    cliente_id: string;
    contacto_id: string;
    oportunidad_id: string;
    tarjeta_id: string;
    incidencia_id: string;
    proyecto_id: string;
    subproyecto_id: string;
    usuario_id: string;
    fecha_fin: string;
}

export type NuevaAccion = {
    fecha: string;
    descripcion: string;
    tipo: string;
    observaciones: string;
};