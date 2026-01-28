import { Contacto } from "../diseño.ts";

export type EstadoDetalleContacto = "INICIAL" | "BORRANDO";

export type ContextoDetalleContacto = {
    estado: EstadoDetalleContacto;
    contacto: Contacto;
    inicial: Contacto;
};