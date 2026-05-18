import { MetaModelo } from "@olula/lib/dominio.js";
import { registroJornadaVacio, metaRegistroJornada } from "../dominio.ts";
import { RegistroJornada } from "../diseño.ts";

export type EstadoDetalleJornada = (
    'INICIAL' | 'BORRADOR' | 'APROBADA' | 'ANULADA'
    | 'APROBANDO' | 'ANULANDO' | 'PAUSANDO' | 'REACTIVANDO'
);

export type ContextoDetalleJornada = {
    estado: EstadoDetalleJornada;
    jornada: RegistroJornada;
};

export const jornadaVacia: RegistroJornada = registroJornadaVacio;

export const metaJornada: MetaModelo<RegistroJornada> = metaRegistroJornada;
