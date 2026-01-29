import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ProcesarListaEntidades, accionesListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Lead } from "../diseño.ts";
import { getLeads } from "../infraestructura.ts";
import { ContextoMaestroLeads, EstadoMaestroLeads } from "./diseño.ts";

export const metaTablaLead: MetaTabla<Lead> = [
    { id: "id", cabecera: "Código" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "tipo", cabecera: "Tipo" },
    { id: "estado_id", cabecera: "Estado" },
    { id: "fuente_id", cabecera: "Fuente" },
];

type ProcesarLeads = ProcesarContexto<EstadoMaestroLeads, ContextoMaestroLeads>;

const conLeads = (fn: ProcesarListaEntidades<Lead>) => (ctx: ContextoMaestroLeads) => ({ ...ctx, leads: fn(ctx.leads) });

export const Leads = accionesListaEntidades(conLeads);

export const recargarLeads: ProcesarLeads = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getLeads(criteria.filtro, criteria.orden, criteria.paginacion);

    return Leads.recargar(contexto, resultado);
}