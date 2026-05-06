import { Cliente } from "../diseño.ts";

export type EstadoDetalleCliente = "INICIAL" | "BORRANDO";

export type ContextoDetalleCliente = {
    estado: EstadoDetalleCliente;
    cliente: Cliente;
};