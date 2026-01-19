import { Cliente, CrmContacto, CuentaBanco, DirCliente } from "../diseño.ts";

export type EstadoDetalleCliente =
    | "INICIAL"
    | "ABIERTO"
    | "CREANDO_CLIENTE"
    | "BAJANDO_CLIENTE"
    | "BORRANDO_CLIENTE"
    | "EDITANDO_CLIENTE"
    | "GUARDANDO_CLIENTE";

export type ContextoDetalleCliente = {
    estado: EstadoDetalleCliente;
    cliente: Cliente;
    clienteInicial: Cliente;
};

// Re-export for convenience
export type { CrmContacto, CuentaBanco, DirCliente };
