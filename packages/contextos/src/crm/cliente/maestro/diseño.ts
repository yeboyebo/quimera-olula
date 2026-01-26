import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Cliente } from "../diseño.ts";

export type EstadoMaestroClientes = "INICIAL" | "CREANDO";

export type ContextoMaestroClientes = {
    estado: EstadoMaestroClientes;
    clientes: ListaEntidades<Cliente>
};