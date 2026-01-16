import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { Lead } from "../diseño.ts";
import { getLead, getLeads, postLead } from "../infraestructura.ts";
import { ContextoMaestroLeads, EstadoMaestroLeads } from "./diseño.ts";

export const metaTablaLead: MetaTabla<Lead> = [
    { id: "id", cabecera: "Código" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "tipo", cabecera: "Tipo" },
    { id: "estado_id", cabecera: "Estado" },
    { id: "fuente_id", cabecera: "Fuente" },
];

type ProcesarLeads = ProcesarContexto<EstadoMaestroLeads, ContextoMaestroLeads>;

export const recargarLeads: ProcesarLeads = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getLeads(criteria.filtro, criteria.orden, criteria.paginacion);
    const leads = resultado.datos

    return {
        ...contexto,
        leads,
        totalLeads: resultado.total === -1 ? contexto.totalLeads : resultado.total,
        activo: contexto.activo
            ? leads.find(lead => lead.id === contexto.activo?.id) ?? null
            : null
    }
}

export const crearLead: ProcesarLeads = async (contexto, payload) => {
    const leadId = await postLead(payload as Lead);
    const lead = await getLead(leadId);

    return {
        ...contexto,
        leads: [lead, ...contexto.leads],
        activo: lead
    }
}

// export const incluirLeadEnLista: ProcesarLeads = async (contexto, payload) => {
//     const lead = payload as Lead;

//     return {
//         ...contexto,
//         leads: [lead, ...contexto.leads]
//     }
// }

export const activarLead: ProcesarLeads = async (contexto, payload) => {
    const activo = payload as Lead;

    return {
        ...contexto,
        activo
    }
}

export const desactivarLeadActivo: ProcesarLeads = async (contexto) => {
    return {
        ...contexto,
        activo: null
    }
}

export const cambiarLeadEnLista: ProcesarLeads = async (contexto, payload) => {
    const lead = payload as Lead;

    return {
        ...contexto,
        leads: contexto.leads.map(item => item.id === lead.id ? lead : item)
    }
}

export const quitarLeadDeLista: ProcesarLeads = async (contexto, payload) => {
    const leadBorrado = payload as Lead;

    return {
        ...contexto,
        leads: contexto.leads.filter(lead => lead.id !== leadBorrado.id),
        activo: null
    }
}
