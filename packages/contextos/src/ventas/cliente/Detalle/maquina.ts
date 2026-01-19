import { Maquina } from "@olula/lib/diseño.js";
import { ContextoCliente, EstadoCliente } from "../diseño.ts";
import {
    abiertoContexto,
    cambiarCliente,
    cancelarCambioCliente,
    cargarContexto,
    getContextoVacio,
    refrescarCliente,
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoCliente, ContextoCliente> = () => {
    return {
        INICIAL: {
            cliente_id_cambiado: [cargarContexto],

            cliente_deseleccionado: [
                getContextoVacio,
            ],
        },

        ABIERTO: {
            cliente_cargado: [abiertoContexto],

            cliente_cambiado: [refrescarCliente],

            edicion_de_cliente_lista: [cambiarCliente],

            edicion_de_cliente_cancelada: [cancelarCambioCliente],
        },

        EDITANDO_CLIENTE: {
            edicion_de_cliente_lista: [cambiarCliente],

            edicion_de_cliente_cancelada: [cancelarCambioCliente],
        },

        GUARDANDO_CLIENTE: {
            cliente_guardado: [refrescarCliente, "ABIERTO"],

            guardado_cancelado: "ABIERTO",
        },
    };
};
