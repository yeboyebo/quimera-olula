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
            creacion_solicitada: "CREANDO_CLIENTE",
            baja_solicitada: "BAJANDO_CLIENTE",
            borrado_solicitado: "BORRANDO_CLIENTE",
        },

        CREANDO_CLIENTE: {
            cliente_creado: [incluirClienteEnLista, "INICIAL"],
            creacion_cancelada: "INICIAL",
        },

        BAJANDO_CLIENTE: {
            cliente_dado_de_baja: [recargarClientes, "INICIAL"],
            baja_cancelada: "INICIAL",
        },

        BORRANDO_CLIENTE: {
            cliente_borrado: [quitarClienteDeLista, "INICIAL"],
            borrado_cancelado: "INICIAL",
        },
    };
};
