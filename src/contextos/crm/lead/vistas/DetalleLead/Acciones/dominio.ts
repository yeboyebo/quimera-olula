import { MetaModelo, stringNoVacio } from "../../../../../comun/dominio.ts";

export type NuevaAccion = {
    fecha: string;
    descripcion: string;
    tipo: string;
    estado: "Pendiente" | "En Progreso" | "Completada" | "Cancelada";
    contacto_id?: string;
    cliente_id?: string;
};

export const nuevaAccionVacia: NuevaAccion = {
    fecha: "",
    descripcion: "",
    tipo: "Tarea",
    estado: "Pendiente",
    contacto_id: "",
    cliente_id: "",
};

export const metaNuevaAccion: MetaModelo<NuevaAccion> = {
    campos: {
        fecha: { requerido: true, tipo: "fecha" },
        descripcion: { requerido: true, validacion: (accion: NuevaAccion) => stringNoVacio(accion.descripcion) },
        tipo: { requerido: true },
        estado: { requerido: true },
        contacto_id: { requerido: false },
        cliente_id: { requerido: false },
    },
};
