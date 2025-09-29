import { MetaTabla } from "../../../componentes/atomos/qtabla.tsx";
import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";
import { Incidencia, NuevaIncidencia } from "./diseño.ts";

export const incidenciaVacia: Incidencia = {
    id: "",
    descripcion: "",
    descripcion_larga: "",
    nombre: "",
    responsable_id: "",
    prioridad: "media",
    fecha: "",

};

export const metaIncidencia: MetaModelo<Incidencia> = {
    campos: {
        descripcion: { requerido: true },
        responsable_id: { requerido: false },
        descripcion_larga: { requerido: false },
        prioridad: { requerido: true },
        fecha: { requerido: true, tipo: "fecha" },
        // nombre_responsable: { requerido: true, bloqueado: true },
    },
};

export const initEstadoIncidencia = (Incidencia: Incidencia): EstadoModelo<Incidencia> =>
    initEstadoModelo(Incidencia);

export const initEstadoIncidenciaVacia = () => initEstadoIncidencia(incidenciaVacia);

export const nuevaIncidenciaVacia: NuevaIncidencia = {
    descripcion: "",
    nombre: "",
    prioridad: "media",
    responsable_id: null,
    descripcion_larga: "",
    fecha: (new Date()).toISOString().split("T")[0],
};

export const metaNuevaIncidencia: MetaModelo<NuevaIncidencia> = {
    campos: {
        descripcion: { requerido: true, validacion: (incidencia: NuevaIncidencia) => stringNoVacio(incidencia.descripcion) },
        nombre: { requerido: true },
        fecha: { requerido: true, tipo: "fecha" },
        responsable_id: { requerido: true, tipo: "autocompletar" },
        descripcion_larga: { requerido: false },
        prioridad: { requerido: true },
        estado: { requerido: true, tipo: "selector" }
    },
};

export const metaTablaIncidencia: MetaTabla<Incidencia> = [
    { id: "id", cabecera: "Código" },
    { id: "descripcion", cabecera: "Descripcion" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "estado", cabecera: "Estado" },
    { id: "prioridad", cabecera: "Prioridad" },
];
