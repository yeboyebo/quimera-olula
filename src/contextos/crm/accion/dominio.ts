import { MetaTabla } from "../../../componentes/atomos/qtabla.tsx";
import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";
import { Accion, NuevaAccion } from "./diseño.ts";


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
    responsable_id: "",
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

// export type NuevaAccion = {
//     fecha: string;
//     descripcion: string;
//     tipo: string;
//     estado: "Pendiente" | "En Progreso" | "Completada" | "Cancelada";
//     observaciones: string;
// };

export const nuevaAccionVacia: NuevaAccion = {
    fecha: "",
    descripcion: "",
    tipo: "Tarea",
    estado: "Pendiente",
    observaciones: "",
    incidencia_id: "",
    responsable_id: "",
    tarjeta_id: "",
    oportunidad_id: "",
    contacto_id: "",
    cliente_id: "",
};

export const metaNuevaAccion: MetaModelo<NuevaAccion> = {
    campos: {
        fecha: { requerido: true, tipo: "fecha" },
        descripcion: { requerido: true, validacion: (accion: NuevaAccion) => stringNoVacio(accion.descripcion) },
        responsable_id: { requerido: true, tipo: "autocompletar" },
    },
};

export const metaTablaAccion: MetaTabla<Accion> = [
    { id: "id", cabecera: "Código" },
    { id: "fecha", cabecera: "Fecha" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "tipo", cabecera: "Tipo" },
    { id: "estado", cabecera: "Estado" },
];