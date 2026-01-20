import { Maquina } from "@olula/lib/diseño.js";
import {
    activarCliente,
    cambiarClienteEnLista,
    desactivarClienteActivo,
    incluirClienteEnLista,
    quitarClienteDeLista,
    recargarClientes,
} from "../dominio.ts";
import { ContextoMaestroCliente, EstadoMaestroCliente } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoMaestroCliente, ContextoMaestroCliente> = () => {
    return {
        INICIAL: {
            cliente_id_cambiado: cambiarClienteEnLista,
            cliente_seleccionado: [activarCliente],
            cliente_deseleccionado: desactivarClienteActivo,
            cliente_borrado: quitarClienteDeLista,
            cliente_creado: incluirClienteEnLista,
            recarga_de_clientes_solicitada: recargarClientes,
        },
    };
};
