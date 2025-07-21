import { EstadoModelo, initEstadoModelo, MetaModelo } from "../../comun/dominio.ts";
import { Lead } from "./diseño.ts";

export const leadVacio: Lead = {
    id: "",
    tipo: "Cliente",
    estado_id: "",
    nombre: "",
    id_fiscal: "",
    cliente_id: "",
    proveedor_id: "",
    direccion: "",
    cod_postal: "",
    ciudad: "",
    provincia_id: "",
    provincia: "",
    pais_id: "",
    pais: "",
    telefono_1: "",
    telefono_2: "",
    email: "",
    web: "",
    contacto_id: "",
    fuente_id: "",
    responsable_id: "",
};

export const metaLead: MetaModelo<Lead> = {
    campos: {
        tipo: { requerido: true, bloqueado: true },
        estado_id: { requerido: true },
        nombre: { requerido: false },
        id_fiscal: { requerido: false },
        cliente_id: { requerido: false },
        proveedor_id: { requerido: false },
        direccion: { requerido: false },
        cod_postal: { requerido: false },
        ciudad: { requerido: false },
        provincia_id: { requerido: false },
        provincia: { requerido: false },
        pais_id: { requerido: false },
        pais: { requerido: false },
        telefono_1: { requerido: false },
        telefono_2: { requerido: false },
        email: { requerido: false, tipo: "email" },
        web: { requerido: false },
        contacto_id: { requerido: false },
        fuente_id: { requerido: true },
        responsable_id: { requerido: false },
    },
};

export const initEstadoLead = (lead: Lead): EstadoModelo<Lead> =>
    initEstadoModelo(lead);

export const initEstadoLeadVacio = () => initEstadoLead(leadVacio);

export type NuevoLead = {
    cliente_id: string;
    tipo: string;
    fuente_id: string;
    estado_id: string;
};

export const nuevoLeadVacio: NuevoLead = {
    cliente_id: "",
    tipo: "Cliente",
    fuente_id: "",
    estado_id: "",
};

export const metaNuevoLead: MetaModelo<NuevoLead> = {
    campos: {
        cliente_id: { requerido: true },
        tipo: { requerido: true, bloqueado: true },
        fuente_id: { requerido: true },
        estado_id: { requerido: true },
    },
};
