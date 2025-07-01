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
    email: "",
    web: "",
    contacto_id: "",
    fuente_id: "",
    responsable_id: "",
};

export const metaLead: MetaModelo<Lead> = {
    campos: {
        tipo: { requerido: true },
        estado_id: { requerido: true },
        nombre: { requerido: false },
        id_fiscal: { requerido: false },
        cliente_id: { requerido: false },
        proveedor_id: { requerido: false },
        direccion: { requerido: false },
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
    tipo: string;
    fuente_id: string;
    estado_id: string;
};

export const nuevoLeadVacio: NuevoLead = {
    tipo: "Cliente",
    fuente_id: "",
    estado_id: "",
};

export const metaNuevoLead: MetaModelo<NuevoLead> = {
    campos: {
        tipo: { requerido: true },
        fuente_id: { requerido: true },
        estado_id: { requerido: true },
    },
};
