import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";
import { Incidencia, NuevaIncidencia } from "./diseño.ts";

export const IncidenciaVacia: Incidencia = {
    id: "",
    descripcion: "",
    descripcion_larga: "",
    nombre: "",
    responsable_id: "",
    prioridad: "media",
    fecha: new Date(),

};

export const metaIncidencia: MetaModelo<Incidencia> = {
    campos: {
        descripcion: { requerido: true },
        responsable_id: { requerido: false },
        descripcion_larga: { requerido: false },
        prioridad: { requerido: true },
        // nombre_responsable: { requerido: true, bloqueado: true },
    },
};

export const initEstadoIncidencia = (Incidencia: Incidencia): EstadoModelo<Incidencia> =>
    initEstadoModelo(Incidencia);

export const initEstadoIncidenciaVacia = () => initEstadoIncidencia(IncidenciaVacia);

export const nuevaIncidenciaVacia: NuevaIncidencia = {
    descripcion: "",
    nombre: "",
    prioridad: "media",
    responsable_id: null,
    descripcion_larga: "",
    fecha: new Date(),
};

export const metaNuevaIncidencia: MetaModelo<NuevaIncidencia> = {
    campos: {
        descripcion: { requerido: true },
        nombre: { requerido: true },
        fecha: { requerido: true, tipo: "fecha" },
        responsable_id: { requerido: false },
        descripcion_larga: { requerido: false },
        prioridad: { requerido: true },
    },
};

export type NuevaAccion = {
    fecha: string;
    descripcion: string;
    tipo: string;
    estado: "Pendiente" | "En Progreso" | "Completada" | "Cancelada";
    contacto_id?: string;
    cliente_id?: string;
    incidencia_id: string;
    usuario_id?: string;
};

export const nuevaAccionVacia: NuevaAccion = {
    fecha: "",
    descripcion: "",
    tipo: "Tarea",
    estado: "Pendiente",
    contacto_id: "",
    cliente_id: "",
    incidencia_id: "",
    usuario_id: "",
};

export const metaNuevaAccion: MetaModelo<NuevaAccion> = {
    campos: {
        fecha: { requerido: true, tipo: "fecha" },
        descripcion: { requerido: true, validacion: (accion: NuevaAccion) => stringNoVacio(accion.descripcion) },
        tipo: { requerido: true },
        estado: { requerido: true },
        contacto_id: { requerido: false },
        cliente_id: { requerido: false },
        incidencia_id: { requerido: true, bloqueado: true },
        usuario_id: { requerido: false }
    },
};

