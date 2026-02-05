import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroCliente, EstadoMaestroCliente } from "./diseño.ts";
import { Clientes, recargarClientes } from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoMaestroCliente, ContextoMaestroCliente> = () => {
    return {
        INICIAL: {
            cliente_cambiado: Clientes.cambiar,
            cliente_seleccionado: [Clientes.activar],
            cliente_deseleccionado: Clientes.desactivar,
            cliente_borrado: Clientes.quitar,
            cliente_creado: Clientes.incluir,
            recarga_de_clientes_solicitada: recargarClientes,
            creacion_solicitada: "CREANDO_CLIENTE",
        },

        CREANDO_CLIENTE: {
            cliente_creado: [Clientes.incluir, "INICIAL"],
            creacion_cancelada: "INICIAL",
        },
    };
};
