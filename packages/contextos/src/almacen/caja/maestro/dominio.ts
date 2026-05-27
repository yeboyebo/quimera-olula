import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import {
    accionesListaActivaEntidades,
    ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.js";
import { Caja } from "../diseño.ts";
import { getCajas } from "../infraestructura.ts";
import { ContextoMaestroCaja, EstadoMaestroCaja } from "./diseño.ts";

export type ProcesarMaestroCaja = ProcesarContexto<EstadoMaestroCaja, ContextoMaestroCaja>;

const conCajas =
    (fn: ProcesarListaActivaEntidades<Caja>) =>
        (ctx: ContextoMaestroCaja) => ({ ...ctx, cajas: fn(ctx.cajas) });

export const Cajas = accionesListaActivaEntidades(conCajas);

export const recargarCajas: ProcesarMaestroCaja = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getCajas(criteria.filtro, criteria.orden, criteria.paginacion);
    return Cajas.recargar(contexto, resultado);
};
