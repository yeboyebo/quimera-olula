import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos } from "@olula/lib/dominio.ts";
import { IaTareaProgramada } from "../diseño.js";
import { iaTareaProgramadaVacia } from "../dominio.js";
import { getIaTareaProgramada, patchIaTareaProgramada } from "../infraestructura.js";
import { ContextoDetalleIaTareaProgramada, EstadoDetalleIaTareaProgramada } from "./diseño.js";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleIaTareaProgramada, ContextoDetalleIaTareaProgramada>;

const pipeTarea = ejecutarListaProcesos<EstadoDetalleIaTareaProgramada, ContextoDetalleIaTareaProgramada>;

export const contextoDetalleIaTareaProgramadaInicial: ContextoDetalleIaTareaProgramada = {
    estado: 'INICIAL',
    tarea: iaTareaProgramadaVacia,
};

export const refrescarIaTareaProgramada: ProcesarDetalle = async (contexto) => {
    const tarea = await getIaTareaProgramada(contexto.tarea.id);
    return [
        { ...contexto, tarea },
        [["tarea_programada_ia_cambiada", tarea]],
    ];
};

/**
 * Guarda cambios en la API (auto-guardado de useModelo, ver
 * DetalleIaTareaProgramada.tsx). No incluye `activo`: se alterna aparte.
 */
export const guardarIaTareaProgramada = async (
    contexto: ContextoDetalleIaTareaProgramada,
    tarea: IaTareaProgramada
): Promise<void> => {
    if (
        tarea.nombre !== contexto.tarea.nombre ||
        tarea.iaFlujoId !== contexto.tarea.iaFlujoId ||
        tarea.expresionCron !== contexto.tarea.expresionCron
    ) {
        await patchIaTareaProgramada(tarea.id, {
            nombre: tarea.nombre,
            iaFlujoId: tarea.iaFlujoId,
            expresionCron: tarea.expresionCron,
        });
    }
};

export const alternarActivoIaTareaProgramada: ProcesarDetalle = async (contexto) => {
    await patchIaTareaProgramada(contexto.tarea.id, { activo: !contexto.tarea.activo });
    const tarea = await getIaTareaProgramada(contexto.tarea.id);
    return [
        { ...contexto, tarea },
        [["tarea_programada_ia_cambiada", tarea]],
    ];
};

export const cargarIaTareaProgramada: (_: string) => ProcesarDetalle =
    (idTarea) => async (contexto) => {
        const tarea = await getIaTareaProgramada(idTarea);
        return pipeTarea(contexto, [
            async (ctx) => ({ ...ctx, tarea }),
            'ABIERTO',
        ]);
    };

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idTarea = payload as string;
    if (idTarea) {
        return cargarIaTareaProgramada(idTarea)(contexto);
    }
    return { ...contexto, estado: 'INICIAL', tarea: iaTareaProgramadaVacia };
};
