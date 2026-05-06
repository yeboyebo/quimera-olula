import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Contacto } from "../diseño.ts";

export type EstadoMaestroContactos = "INICIAL" | "CREANDO";

export type ContextoMaestroContactos = {
    estado: EstadoMaestroContactos;
    contactos: ListaActivaEntidades<Contacto>
};