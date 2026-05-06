import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Cliente } from "../diseño.ts";

export type EstadoMaestroClientes = "INICIAL";

export type ContextoMaestroClientes = {
    estado: EstadoMaestroClientes;
    clientes: ListaActivaEntidades<Cliente>
};