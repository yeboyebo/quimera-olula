import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import {
    MovimientoBancario,
    ResumenConciliacionAutomatica,
    ResumenSincronizacionMovimientoBancario,
} from "../diseño.js";
import { getMovimientosBancarios } from "../infraestructura.js";
import { ContextoMaestroConciliacion, EstadoMaestroConciliacion } from "./diseño.js";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroConciliacion, ContextoMaestroConciliacion>;

const conMovimientos = (fn: ProcesarListaActivaEntidades<MovimientoBancario>) =>
    (ctx: ContextoMaestroConciliacion) => ({ ...ctx, movimientos: fn(ctx.movimientos) });

export const Movimientos = accionesListaActivaEntidades(conMovimientos);

export const recargarMovimientos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getMovimientosBancarios(criteria);
    return Movimientos.recargar(contexto, resultado);
};

export const ampliarMovimientos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getMovimientosBancarios(criteria);
    return Movimientos.ampliar(contexto, resultado);
};

/** Recarga la lista con el criteria actual (patrón `recargarRecibosActual` de recibo_venta). */
export const recargarMovimientosActual: ProcesarMaestro = async (contexto) => {
    const resultado = await getMovimientosBancarios(contexto.movimientos.criteria);
    return Movimientos.recargar(contexto, resultado);
};

/**
 * Se invoca cuando SincronizarMovimientoBancario.tsx termina la sincronización:
 * recarga la lista con el resultado fresco y guarda el resumen para mostrarlo.
 */
export const aplicarResumenSincronizacion: ProcesarMaestro = async (contexto, payload) => {
    const resumen = payload as ResumenSincronizacionMovimientoBancario;
    const recargado = (await recargarMovimientosActual(contexto)) as ContextoMaestroConciliacion;

    return {
        ...recargado,
        estado: "INICIAL",
        resumenSincronizacion: resumen,
    };
};

export const cerrarResumenSincronizacion: ProcesarMaestro = async (contexto) => ({
    ...contexto,
    resumenSincronizacion: null,
});

/** Tras "Conciliar automáticamente": recarga la lista y guarda el resumen para mostrarlo. */
export const aplicarResumenConciliacionAutomatica: ProcesarMaestro = async (contexto, payload) => {
    const resumen = payload as ResumenConciliacionAutomatica;
    const recargado = (await recargarMovimientosActual(contexto)) as ContextoMaestroConciliacion;

    return {
        ...recargado,
        estado: "INICIAL",
        resumenConciliacionAutomatica: resumen,
    };
};

export const cerrarResumenConciliacionAutomatica: ProcesarMaestro = async (contexto) => ({
    ...contexto,
    resumenConciliacionAutomatica: null,
});
