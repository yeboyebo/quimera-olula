import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ProcesarListaActivaEntidades, accionesListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { RegistroJornada } from "../diseño.ts";
import { getJornada, getJornadas } from "../infraestructura.ts";
import { ContextoMaestroJornadas, EstadoMaestroJornadas } from "./diseño.ts";

type ProcesarJornadas = ProcesarContexto<EstadoMaestroJornadas, ContextoMaestroJornadas>;

const conJornadas = (fn: ProcesarListaActivaEntidades<RegistroJornada>) =>
    (ctx: ContextoMaestroJornadas) => ({ ...ctx, jornadas: fn(ctx.jornadas) });

export const Jornadas = accionesListaActivaEntidades(conJornadas);

export const recargarJornadas: ProcesarJornadas = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getJornadas(criteria.filtro, criteria.orden, criteria.paginacion);
    return Jornadas.recargar(contexto, resultado);
};

export const ampliarJornadas: ProcesarJornadas = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getJornadas(criteria.filtro, criteria.orden, criteria.paginacion);
    return Jornadas.ampliar(contexto, resultado);
};

export const jornadaCreada: ProcesarJornadas = async (contexto, payload) => {
    const idJornada = payload as string;
    const jornada = await getJornada(idJornada);
    return {
        ...contexto,
        estado: "INICIAL" as EstadoMaestroJornadas,
        jornadas: {
            lista: [jornada, ...contexto.jornadas.lista],
            activo: jornada.id,
            total: contexto.jornadas.total + 1,
            criteria: contexto.jornadas.criteria,
        },
    };
};
