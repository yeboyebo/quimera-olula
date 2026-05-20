import { MetaTabla } from "@olula/componentes/index.js";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Comunicacion } from "../diseño.ts";

export type EstadoMaestroComunicacion = "INICIAL";

export type ContextoMaestroComunicacion = {
    estado: EstadoMaestroComunicacion;
    comunicaciones: ListaActivaEntidades<Comunicacion>;
};

export const metaTablaComunicacion: MetaTabla<Comunicacion> = [
    { id: "id", cabecera: "Id" },
    { id: "asunto", cabecera: "Asunto" },
    { id: "estado", cabecera: "Estado" },
    { id: "fechaEnvio", cabecera: "Enviada", tipo: "fechahora" },
    { id: "fechaLectura", cabecera: "Leída", tipo: "fechahora" },
];
