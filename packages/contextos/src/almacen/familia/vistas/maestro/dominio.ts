import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import {
    accionesListaActivaEntidades,
    ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.js";
import { Familia } from "../../diseño.ts";
import { getFamilias } from "../../infraestructura.ts";
import { ContextoMaestroFamilia, EstadoMaestroFamilia } from "./diseño.ts";

type ProcesarMaestroFamilia = ProcesarContexto<
    EstadoMaestroFamilia,
    ContextoMaestroFamilia
>;

const conFamilias =
    (fn: ProcesarListaActivaEntidades<Familia>) =>
        (ctx: ContextoMaestroFamilia) => ({ ...ctx, familias: fn(ctx.familias) });

export const Familias = accionesListaActivaEntidades(conFamilias);

export const recargarFamilias: ProcesarMaestroFamilia = async (
    contexto,
    payload
) => {
    const criteria = payload as Criteria;
    const resultado = await getFamilias(
        criteria.filtro,
        criteria.orden,
        criteria.paginacion
    );

    return Familias.recargar(contexto, resultado);
};
