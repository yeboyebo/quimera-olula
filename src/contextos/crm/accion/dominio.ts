import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";

export type Accion = {
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
};

export const accionVacia: Accion = {
    id: "",
    fecha: "",
    descripcion: "",
    estado: "",
    observaciones: "",
    agente_id: "",
    tipo: "",
    cliente_id: "",
    contacto_id: "",
    oportunidad_id: "",
    tarjeta_id: "",
    incidencia_id: "",
    proyecto_id: "",
    subproyecto_id: "",
    usuario_id: "",
    fecha_fin: "",
};

export const metaAccion: MetaModelo<Accion> = {
    campos: {
        fecha: { requerido: true, tipo: "fecha" },
        descripcion: { requerido: true, validacion: (accion: Accion) => stringNoVacio(accion.descripcion) },
        observaciones: { requerido: false },
        agente_id: { requerido: false },
        tipo: { requerido: false },
    },
};

export const initEstadoAccion = (accion: Accion): EstadoModelo<Accion> =>
    initEstadoModelo(accion);

export const initEstadoAccionVacia = () => initEstadoAccion(accionVacia);

export type NuevaAccion = {
    fecha: string;
    descripcion: string;
    tipo: string;
    observaciones: string;
};

export const nuevaAccionVacia: NuevaAccion = {
    fecha: "",
    descripcion: "",
    tipo: "",
    observaciones: "",
};

export const metaNuevaAccion: MetaModelo<NuevaAccion> = {
    campos: {
        fecha: { requerido: true, tipo: "fecha" },
        descripcion: { requerido: true, validacion: (accion: NuevaAccion) => stringNoVacio(accion.descripcion) },
        tipo: { requerido: false },
        observaciones: { requerido: false },
    },
};
