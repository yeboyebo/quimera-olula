import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { pipe } from "@olula/lib/funcional.js";
import { Incidencia } from "../diseño.ts";
import { getIncidencias } from "../infraestructura.ts";
import { ContextoMaestroIncidencias, EstadoMaestroIncidencias } from "./diseño.ts";

export const metaTablaIncidencia: MetaTabla<Incidencia> = [
    { id: "id", cabecera: "Código" },
    { id: "descripcion", cabecera: "Descripcion" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "estado", cabecera: "Estado" },
    { id: "prioridad", cabecera: "Prioridad" },
];

type ProcesarIncidencias = ProcesarContexto<EstadoMaestroIncidencias, ContextoMaestroIncidencias>;

// const conEstado = (estado: EstadoMaestroIncidencias) => (ctx: ContextoMaestroIncidencias) => ({ ...ctx, estado });
const conIncidencias = (incidencias: Incidencia[]) => (ctx: ContextoMaestroIncidencias) => ({ ...ctx, incidencias });
const conTotal = (totalIncidencias: number) => (ctx: ContextoMaestroIncidencias) => ({ ...ctx, totalIncidencias });
const conActiva = (activa: Incidencia | null) => (ctx: ContextoMaestroIncidencias) => ({ ...ctx, activa });

export const recargarIncidencias: ProcesarIncidencias = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const { datos: incidencias, total } = await getIncidencias(criteria.filtro, criteria.orden, criteria.paginacion);

    return pipe(
        contexto,
        conIncidencias(incidencias),
        conTotal(total === -1 ? contexto.totalIncidencias : total),
        conActiva(contexto.activa
            ? incidencias.find(incidencia => incidencia.id === contexto.activa?.id) ?? null
            : null)
    )
}

export const incluirIncidenciaEnLista: ProcesarIncidencias = async (contexto, payload) => {
    const incidencia = payload as Incidencia;

    return pipe(
        contexto,
        conIncidencias([incidencia, ...contexto.incidencias])
    )
}

export const activarIncidencia: ProcesarIncidencias = async (contexto, payload) => {
    const activa = payload as Incidencia;

    return pipe(
        contexto,
        conActiva(activa)
    )
}

export const desactivarIncidenciaActiva: ProcesarIncidencias = async (contexto) => {
    return pipe(
        contexto,
        conActiva(null)
    )
}

export const cambiarIncidenciaEnLista: ProcesarIncidencias = async (contexto, payload) => {
    const incidencia = payload as Incidencia;

    return pipe(
        contexto,
        conIncidencias(contexto.incidencias.map(item => item.id === incidencia.id ? incidencia : item))
    )
}

export const quitarIncidenciaDeLista: ProcesarIncidencias = async (contexto, payload) => {
    const idBorrado = payload as string;

    return pipe(
        contexto,
        conIncidencias(contexto.incidencias.filter(incidencia => incidencia.id !== idBorrado)),
        conActiva(null)
    )
}
