import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ProcesarListaEntidades, accionesListaEntidades } from "@olula/lib/ListaEntidades.js";
import { EstadoOportunidad } from "../diseño.ts";
import { getEstadosOportunidad } from "../infraestructura.ts";
import { ContextoMaestroEstadosOportunidad, EstadoMaestroEstadosOportunidad } from "./diseño.ts";

export const metaTablaEstadoOportunidad: MetaTabla<EstadoOportunidad> = [
    { id: "id", cabecera: "Código" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "probabilidad", cabecera: "Probabilidad", tipo: "numero" },
    { id: "valor_defecto", cabecera: "Por defecto", tipo: "booleano" },
];

type ProcesarEstadosOportunidad = ProcesarContexto<EstadoMaestroEstadosOportunidad, ContextoMaestroEstadosOportunidad>;

const conEstadosOportunidad = (fn: ProcesarListaEntidades<EstadoOportunidad>) => (ctx: ContextoMaestroEstadosOportunidad) => ({ ...ctx, estados_oportunidad: fn(ctx.estados_oportunidad) });

export const EstadosOportunidad = accionesListaEntidades(conEstadosOportunidad);

export const recargarEstadosOportunidad: ProcesarEstadosOportunidad = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getEstadosOportunidad(criteria.filtro, criteria.orden, criteria.paginacion);

    return EstadosOportunidad.recargar(contexto, resultado);
}