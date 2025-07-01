import { Entidad } from "../../comun/diseño.ts";

export interface Lead extends Entidad {
    id: string;
    tipo: string;
    estado_id: string;
    nombre: string;
    id_fiscal: string;
    cliente_id: string;
    proveedor_id: string;
    direccion: string;
    email: string;
    web: string;
    contacto_id: string;
    fuente_id: string;
    responsable_id: string;
}

export type NuevoLead = {
    tipo: string;
    fuente_id: string;
    estado_id: string;
};