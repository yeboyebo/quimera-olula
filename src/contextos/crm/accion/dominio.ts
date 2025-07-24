import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";
import { Accion } from "./diseño.ts";


export const accionVacia: Accion = {
    id: "",
    fecha: "",
    descripcion: "",
    estado: "",
    observaciones: "",
    agente_id: "",
    tipo: "",
    cliente_id: "",
    nombre_cliente: "",
    contacto_id: "",
    nombre_contacto: "",
    oportunidad_id: "",
    descripcion_oportunidad: "",
    tarjeta_id: "",
    incidencia_id: "",
    usuario_id: "",
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
    estado: "Pendiente" | "En Progreso" | "Completada" | "Cancelada";
    observaciones: string;
};

export const nuevaAccionVacia: NuevaAccion = {
    fecha: "",
    descripcion: "",
    tipo: "Tarea",
    estado: "Pendiente",
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
