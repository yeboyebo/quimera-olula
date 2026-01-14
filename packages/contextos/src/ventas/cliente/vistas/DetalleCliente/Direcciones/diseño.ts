import { DirCliente } from "../../../diseño.ts";

export type EstadoDirecciones = "lista" | "alta" | "edicion" | "confirmar_borrado";

export type ContextoDirecciones = {
    estado: EstadoDirecciones;
    direcciones: DirCliente[];
    direccionActiva: DirCliente | null;
    cargando: boolean;
    clienteId: string;
};
