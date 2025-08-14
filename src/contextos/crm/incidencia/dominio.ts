import { EstadoModelo, initEstadoModelo, MetaModelo } from "../../comun/dominio.ts";
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
    fecha: ""
    // new Date(),
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



