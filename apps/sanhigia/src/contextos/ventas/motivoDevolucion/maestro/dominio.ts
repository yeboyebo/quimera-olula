import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import {
    accionesListaActivaEntidades,
    ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.js";
import { MotivoDevolucion } from "../diseño.ts";
import { getMotivosDevolucion } from "../infraestructura.ts";
import {
    ContextoMaestroMotivoDevolucion,
    EstadoMaestroMotivoDevolucion,
} from "./diseño.ts";

type ProcesarMaestroMotivoDevolucion = ProcesarContexto<
    EstadoMaestroMotivoDevolucion,
    ContextoMaestroMotivoDevolucion
>;

const conMotivosDevolucion =
    (fn: ProcesarListaActivaEntidades<MotivoDevolucion>) =>
        (ctx: ContextoMaestroMotivoDevolucion) => ({
            ...ctx,
            motivosDevolucion: fn(ctx.motivosDevolucion),
        });

export const MotivosDevolucion = accionesListaActivaEntidades(
    conMotivosDevolucion
);

export const recargarMotivosDevolucion: ProcesarMaestroMotivoDevolucion =
    async (contexto, payload) => {
        const criteria = payload as Criteria;
        const resultado = await getMotivosDevolucion(
            criteria.filtro,
            criteria.orden,
            criteria.paginacion
        );

        return MotivosDevolucion.recargar(contexto, resultado);
    };

export const ampliarMotivosDevolucion: ProcesarMaestroMotivoDevolucion =
    async (contexto, payload) => {
        const criteria = payload as Criteria;
        const resultado = await getMotivosDevolucion(
            criteria.filtro,
            criteria.orden,
            criteria.paginacion
        );

        return MotivosDevolucion.ampliar(contexto, resultado);
    };