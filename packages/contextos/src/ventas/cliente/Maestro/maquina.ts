import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroCliente, EstadoMaestroCliente } from "./diseño.ts";
import {
    activarCliente,
    cambiarClienteEnLista,
    desactivarClienteActivo,
    incluirClienteEnLista,
    quitarClienteDeLista,
    recargarClientes,
} from "./dominio.ts";

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
