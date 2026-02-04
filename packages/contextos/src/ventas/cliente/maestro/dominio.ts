import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaEntidades, ProcesarListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Cliente } from "../diseño.ts";
import { getClientes } from "../infraestructura.ts";
import { ContextoMaestroCliente, EstadoMaestroCliente } from "./diseño.ts";

export type ProcesarMaestroCliente = ProcesarContexto<EstadoMaestroCliente, ContextoMaestroCliente>;

const conClientes = (fn: ProcesarListaEntidades<Cliente>) => (ctx: ContextoMaestroCliente) => ({ ...ctx, clientes: fn(ctx.clientes) });

export const Clientes = accionesListaEntidades(conClientes);

export const recargarClientes: ProcesarMaestroCliente = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getClientes(criteria.filtro, criteria.orden, criteria.paginacion);

    return Clientes.recargar(contexto, resultado);
}

