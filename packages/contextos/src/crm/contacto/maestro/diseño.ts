import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Contacto } from "../diseño.ts";

export type EstadoMaestroContactos = "INICIAL" | "CREANDO";

export type ContextoMaestroContactos = {
    estado: EstadoMaestroContactos;
    contactos: ListaEntidades<Contacto>
};