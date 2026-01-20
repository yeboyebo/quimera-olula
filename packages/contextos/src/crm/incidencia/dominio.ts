import { EstadoModelo, initEstadoModelo, MetaModelo } from "@olula/lib/dominio.ts";
import { Incidencia } from "./diseño.ts";

export const incidenciaVacia: Incidencia = {
    id: "",
    descripcion: "",
    descripcion_larga: "",
    nombre: "",
    responsable_id: "",
    prioridad: "media",
    fecha: "",
    estado: "nueva",
};

export const metaIncidencia: MetaModelo<Incidencia> = {
    campos: {
        descripcion: { requerido: true },
        responsable_id: { requerido: false },
        descripcion_larga: { requerido: false },
        prioridad: { requerido: true },
        fecha: { requerido: true, tipo: "fecha" },
        estado: { requerido: true, tipo: "selector" },
        // nombre_responsable: { requerido: true, bloqueado: true },
    },
};

export const initEstadoIncidencia = (Incidencia: Incidencia): EstadoModelo<Incidencia> =>
    initEstadoModelo(Incidencia);

export const initEstadoIncidenciaVacia = () => initEstadoIncidencia(incidenciaVacia);
