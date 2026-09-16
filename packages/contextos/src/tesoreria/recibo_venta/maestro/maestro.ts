import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ReciboVenta } from "../diseño.js";
import { puedenAgruparse } from "../dominio.js";
import { agruparRecibosVenta, getRecibosVenta } from "../infraestructura.js";
import { ContextoMaestroReciboVenta, EstadoMaestroReciboVenta } from "./diseño.js";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroReciboVenta, ContextoMaestroReciboVenta>;

const conRecibos = (fn: ProcesarListaActivaEntidades<ReciboVenta>) =>
    (ctx: ContextoMaestroReciboVenta) => ({ ...ctx, recibos: fn(ctx.recibos) });

export const Recibos = accionesListaActivaEntidades(conRecibos);

export const recargarRecibos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getRecibosVenta(criteria);
    return Recibos.recargar(contexto, resultado);
};

export const ampliarRecibos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getRecibosVenta(criteria);
    return Recibos.ampliar(contexto, resultado);
};

export const recargarRecibosActual: ProcesarMaestro = async (contexto) => {
    const resultado = await getRecibosVenta(contexto.recibos.criteria);
    return Recibos.recargar(contexto, resultado);
};

export const seleccionadosCambiados: ProcesarMaestro = async (contexto, payload) => ({
    ...contexto,
    seleccionados: payload as string[],
});

export const recibosAAgrupar = (ids: string[], recibos: ReciboVenta[]): ReciboVenta[] =>
    recibos.filter((recibo) => ids.includes(recibo.id));

export const agruparSeleccionados: ProcesarMaestro = async (contexto) => {
    const aAgrupar = recibosAAgrupar(contexto.seleccionados, contexto.recibos.lista);

    if (!puedenAgruparse(aAgrupar)) return { ...contexto, estado: 'INICIAL' };

    const ids = aAgrupar.map((recibo) => recibo.id);
    const grupoId = await agruparRecibosVenta(ids[0], ids);

    const resultado = await getRecibosVenta(contexto.recibos.criteria);
    const recargado = (await Recibos.recargar(
        { ...contexto, estado: 'INICIAL', seleccionados: [] },
        resultado
    )) as ContextoMaestroReciboVenta;

    return Recibos.activar(recargado, grupoId);
};
