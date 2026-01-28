import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Cliente } from "../diseño.ts";

export type EstadoMaestroClientes = "INICIAL";

export type ContextoMaestroClientes = {
    estado: EstadoMaestroClientes;
    clientes: ListaEntidades<Cliente>
};