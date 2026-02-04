import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { accionesListaEntidades, ProcesarListaEntidades } from "@olula/lib/ListaEntidades.js";
import { getPresupuestos } from "../infraestructura.ts";
import { ContextoMaestroPresupuesto, EstadoMaestroPresupuesto, Presupuesto } from "./diseño.ts";

type ProcesarPresupuestos = ProcesarContexto<EstadoMaestroPresupuesto, ContextoMaestroPresupuesto>;

const conPresupuestos = (fn: ProcesarListaEntidades<Presupuesto>) => (ctx: ContextoMaestroPresupuesto) => ({ ...ctx, presupuestos: fn(ctx.presupuestos) });

export const Presupuestos = accionesListaEntidades(conPresupuestos);

export const recargarPresupuestos: ProcesarPresupuestos = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPresupuestos(criteria.filtro, criteria.orden, criteria.paginacion);

    return Presupuestos.recargar(contexto, resultado);
}
