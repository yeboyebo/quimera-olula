import { Cliente } from "../diseño.ts";

export type EstadoCliente =
    | "INICIAL"
    | "ABIERTO"
    | "BAJANDO_CLIENTE"
    | "BORRANDO_CLIENTE"
    | "EDITANDO_CLIENTE"
    | "GUARDANDO_CLIENTE"

export type ContextoCliente = {
    estado: EstadoCliente;
    cliente: Cliente;
    clienteInicial: Cliente;
};