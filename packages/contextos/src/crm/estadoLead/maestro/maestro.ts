import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ProcesarListaEntidades, accionesListaEntidades } from "@olula/lib/ListaEntidades.js";
import { EstadoLead } from "../diseño.ts";
import { getEstadosLead } from "../infraestructura.ts";
import { ContextoMaestroEstadosLead, EstadoMaestroEstadosLead } from "./diseño.ts";

export const metaTablaEstadoLead: MetaTabla<EstadoLead> = [
    { id: "id", cabecera: "Código" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "valor_defecto", cabecera: "Por defecto", tipo: "booleano" },
];

type ProcesarEstadosLead = ProcesarContexto<EstadoMaestroEstadosLead, ContextoMaestroEstadosLead>;

const conEstadosLead = (fn: ProcesarListaEntidades<EstadoLead>) => (ctx: ContextoMaestroEstadosLead) => ({ ...ctx, estados_lead: fn(ctx.estados_lead) });

export const EstadosLead = accionesListaEntidades(conEstadosLead);

export const recargarEstadosLead: ProcesarEstadosLead = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getEstadosLead(criteria.filtro, criteria.orden, criteria.paginacion);

    return EstadosLead.recargar(contexto, resultado);
}