import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ModLin } from "../diseño.js";
import { getModLin, getModLins, postModLin } from "../infraestructura.js";
import { ContextoMaestroModLin, EstadoMaestroModLin } from "./diseño.js";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroModLin, ContextoMaestroModLin>;

const conModLins = (fn: ProcesarListaActivaEntidades<ModLin>) =>
    (ctx: ContextoMaestroModLin) => ({ ...ctx, modLins: fn(ctx.modLins) });

export const ModLins = accionesListaActivaEntidades(conModLins);

export const recargarModLins: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getModLins(criteria.filtro, criteria.orden, criteria.paginacion);
    return ModLins.recargar(contexto, resultado);
};

export const ampliarModLins: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getModLins(criteria.filtro, criteria.orden, criteria.paginacion);
    return ModLins.ampliar(contexto, resultado);
};

export const crearModLinProceso: ProcesarMaestro = async (contexto, payload) => {
    const nuevoModLin = payload as Parameters<typeof postModLin>[0];
    const idModLin = await postModLin(nuevoModLin);
    const modLin = await getModLin(idModLin);
    const resultado = await ModLins.incluir(contexto, modLin);

    return {
        ...resultado,
        modLins: {
            ...resultado.modLins,
            activo: modLin.id,
        },
    };
};
