import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { pipe } from "@olula/lib/funcional.js";
import { Accion } from "../diseño.ts";
import { getAcciones } from "../infraestructura.ts";
import { ContextoMaestroAcciones, EstadoMaestroAcciones } from "./diseño.ts";

export const metaTablaAccion: MetaTabla<Accion> = [
    { id: "id", cabecera: "Código" },
    { id: "fecha", cabecera: "Fecha", tipo: "fecha" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "tipo", cabecera: "Tipo" },
    { id: "estado", cabecera: "Estado" },
];

type ProcesarAcciones = ProcesarContexto<EstadoMaestroAcciones, ContextoMaestroAcciones>;

// const conEstado = (estado: EstadoMaestroAcciones) => (ctx: ContextoMaestroAcciones) => ({ ...ctx, estado });
const conAcciones = (acciones: Accion[]) => (ctx: ContextoMaestroAcciones) => ({ ...ctx, acciones });
const conTotal = (totalAcciones: number) => (ctx: ContextoMaestroAcciones) => ({ ...ctx, totalAcciones });
const conActiva = (activa: Accion | null) => (ctx: ContextoMaestroAcciones) => ({ ...ctx, activa });

export const recargarAcciones: ProcesarAcciones = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const { datos: acciones, total } = await getAcciones(criteria.filtro, criteria.orden, criteria.paginacion);

    return pipe(
        contexto,
        conAcciones(acciones),
        conTotal(total === -1 ? contexto.totalAcciones : total),
        conActiva(contexto.activa
            ? acciones.find(accion => accion.id === contexto.activa?.id) ?? null
            : null)
    )
}

export const incluirAccionEnLista: ProcesarAcciones = async (contexto, payload) => {
    const accion = payload as Accion;

    return pipe(
        contexto,
        conAcciones([accion, ...contexto.acciones])
    )
}

export const activarAccion: ProcesarAcciones = async (contexto, payload) => {
    const activa = payload as Accion;

    return pipe(
        contexto,
        conActiva(activa)
    )
}

export const desactivarAccionActiva: ProcesarAcciones = async (contexto) => {
    return pipe(
        contexto,
        conActiva(null)
    )
}

export const cambiarAccionEnLista: ProcesarAcciones = async (contexto, payload) => {
    const accion = payload as Accion;

    return pipe(
        contexto,
        conAcciones(contexto.acciones.map(item => item.id === accion.id ? accion : item))
    )
}

export const quitarAccionDeLista: ProcesarAcciones = async (contexto, payload) => {
    // const borrada = payload as Accion;
    const idBorrada = payload as string;

    return pipe(
        contexto,
        // conAcciones(contexto.acciones.filter(accion => accion.id !== borrada.id)),
        conAcciones(contexto.acciones.filter(accion => accion.id !== idBorrada)),
        conActiva(null)
    )
}
