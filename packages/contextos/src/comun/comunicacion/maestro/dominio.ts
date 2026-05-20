import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import {
    ProcesarListaActivaEntidades,
    accionesListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.js";
import { Comunicacion } from "../diseño.ts";
import { getComunicaciones } from "../infraestructura.ts";
import {
    ContextoMaestroComunicacion,
    EstadoMaestroComunicacion,
} from "./diseño.ts";

type ProcesarComunicaciones = ProcesarContexto<
    EstadoMaestroComunicacion,
    ContextoMaestroComunicacion
>;

const conComunicaciones =
    (fn: ProcesarListaActivaEntidades<Comunicacion>) =>
        (ctx: ContextoMaestroComunicacion) => ({
            ...ctx,
            comunicaciones: fn(ctx.comunicaciones),
        });

export const Comunicaciones = accionesListaActivaEntidades(conComunicaciones);

export const recargarComunicaciones: ProcesarComunicaciones = async (
    contexto,
    payload
) => {
    const criteria = payload as Criteria;
    const resultado = await getComunicaciones(
        criteria.filtro,
        criteria.orden,
        criteria.paginacion
    );

    return Comunicaciones.recargar(contexto, resultado);
};

export const ampliarComunicaciones: ProcesarComunicaciones = async (
    contexto,
    payload
) => {
    const criteria = payload as Criteria;
    const resultado = await getComunicaciones(
        criteria.filtro,
        criteria.orden,
        criteria.paginacion
    );

    return Comunicaciones.ampliar(contexto, resultado);
};
