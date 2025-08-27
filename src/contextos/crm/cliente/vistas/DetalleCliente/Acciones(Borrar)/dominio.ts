import { MetaModelo, stringNoVacio } from "../../../../../comun/dominio.ts";

export type NuevaAccion = {
    fecha: string;
    descripcion: string;
    tipo: string;
    estado: "Pendiente" | "En Progreso" | "Completada" | "Cancelada";
    cliente_id: string;
};

export const nuevaAccionVacia: NuevaAccion = {
    fecha: "",
    descripcion: "",
    tipo: "Tarea",
    estado: "Pendiente",
    cliente_id: "",
};

export const metaNuevaAccion: MetaModelo<NuevaAccion> = {
    campos: {
        fecha: { requerido: true, tipo: "fecha" },
        descripcion: { requerido: true, validacion: (accion: NuevaAccion) => stringNoVacio(accion.descripcion) },
        tipo: { requerido: true },
        estado: { requerido: true },
        cliente_id: { requerido: false },
    },
};
