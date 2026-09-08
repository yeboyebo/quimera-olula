import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { IaTareaProgramada } from "../diseño.js";
import { getIaTareaProgramada, getIaTareasProgramadas } from "../infraestructura.js";
import { ContextoMaestroIaTareaProgramada, EstadoMaestroIaTareaProgramada } from "./diseño.js";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroIaTareaProgramada, ContextoMaestroIaTareaProgramada>;

const conTareas = (fn: ProcesarListaActivaEntidades<IaTareaProgramada>) =>
    (ctx: ContextoMaestroIaTareaProgramada) => ({ ...ctx, tareas: fn(ctx.tareas) });

export const Tareas = accionesListaActivaEntidades(conTareas);

export const recargarTareas: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getIaTareasProgramadas(criteria);
    return Tareas.recargar(contexto, resultado);
};

export const ampliarTareas: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getIaTareasProgramadas(criteria);
    return Tareas.ampliar(contexto, resultado);
};

export const incluirTareaCreadaPorId: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    const tarea = await getIaTareaProgramada(id);
    return {
        ...contexto,
        estado: "INICIAL",
        tareas: {
            ...contexto.tareas,
            lista: [tarea, ...contexto.tareas.lista],
            total: contexto.tareas.total + 1,
            activo: tarea.id,
        },
    };
};
