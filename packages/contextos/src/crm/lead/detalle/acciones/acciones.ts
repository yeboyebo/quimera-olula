import { Accion } from "#/crm/accion/diseño.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { ProcesarContexto } from "@olula/lib/diseño.js";
import { accionesListaEntidades, ProcesarListaEntidades } from "@olula/lib/ListaEntidades.js";
import { getAccionesLead } from "../../infraestructura.ts";
import { ContextoAccionesLead, EstadoAccionesLead } from "./diseño.ts";

export const metaTablaAccion: MetaTabla<Accion> = [
    { id: "id", cabecera: "Código" },
    { id: "fecha", cabecera: "Fecha", tipo: "fecha" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "tipo", cabecera: "Tipo" },
    { id: "estado", cabecera: "Estado" },
];

type ProcesarAcciones = ProcesarContexto<EstadoAccionesLead, ContextoAccionesLead>;


const conAcciones = (fn: ProcesarListaEntidades<Accion>) => (ctx: ContextoAccionesLead) => ({ ...ctx, acciones: fn(ctx.acciones) });

export const Acciones = accionesListaEntidades(conAcciones);

export const recargarAcciones: ProcesarAcciones = async (contexto, payload) => {
    const leadId = payload as string;
    const resultado = await getAccionesLead(leadId);

    return Acciones.recargar(contexto, resultado);
}