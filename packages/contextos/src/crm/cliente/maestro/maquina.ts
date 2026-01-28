import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroClientes, EstadoMaestroClientes } from "./diseño.ts";
import { Clientes, recargarClientes } from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroClientes, ContextoMaestroClientes> = () => {
    return {
        INICIAL: {
            cliente_cambiado: [Clientes.cambiar],

            cliente_seleccionado: [Clientes.activar],

            cliente_deseleccionado: [Clientes.desactivar],

            cliente_borrado: [Clientes.quitar],

            recarga_de_clientes_solicitada: recargarClientes,
        }
    }
}
