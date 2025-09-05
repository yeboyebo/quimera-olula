import { Entidad } from "../../../../../src/contextos/comun/diseño.ts";

export interface Lead extends Entidad {
    id: string;
    tipo: string;
    estado_id: string;
    nombre: string;
    id_fiscal: string;
    cliente_id: string;
    proveedor_id: string | null;
    direccion: string;
    cod_postal: string | null;
    ciudad: string;
    provincia_id: string;
    provincia: string;
    pais_id: string;
    pais: string | null;
    telefono_1: string;
    telefono_2: string;
    email: string;
    web: string;
    contacto_id: string;
    fuente_id: string;
    responsable_id: string;
}

export interface LeadAPI extends Entidad {
    id: string;
    tipo: string;
    estado_id: string;
    nombre: string;
    id_fiscal: string;
    cliente_id: string;
    proveedor_id: string;
    direccion: DireccionLead;
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

export type DireccionLead = {
    direccion: string;
    cod_postal: string;
    ciudad: string;
    provincia_id: string;
    provincia: string;
    pais_id: string;
    pais: string;
    telefono_1: string;
    telefono_2: string;
};
