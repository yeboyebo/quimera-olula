import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoCliente, EstadoCliente } from "../diseño.ts";
import {
    abiertoContexto,
    cambiarCliente,
    cancelarCambioCliente,
    cargarContexto,
    darDeAltaClienteProceso,
    getContextoVacio,
    refrescarCliente,
} from "../dominio.ts";

export const getMaquina: () => Maquina<EstadoCliente, ContextoCliente> = () => {
    return {
        INICIAL: {
            cliente_id_cambiado: [cargarContexto],

            cliente_deseleccionado: [
                getContextoVacio,
                publicar("cliente_deseleccionado", null),
            ],
        },

        ABIERTO: {
            cliente_cargado: [abiertoContexto],

            cliente_cambiado: [refrescarCliente],

            edicion_de_cliente_lista: [cambiarCliente],

            edicion_de_cliente_cancelada: [cancelarCambioCliente],

            baja_solicitada: "BAJANDO_CLIENTE",

            borrado_solicitado: "BORRANDO_CLIENTE",

            dar_de_alta_solicitado: "DANDO_DE_ALTA",
        },

        BAJANDO_CLIENTE: {
            cliente_dado_de_baja: [refrescarCliente, "ABIERTO"],

            baja_cancelada: "ABIERTO",
        },

        BORRANDO_CLIENTE: {
            cliente_borrado: [publicar("cliente_borrado", null), "ABIERTO"],

            borrado_cancelado: "ABIERTO",
        },

        DANDO_DE_ALTA: {
            cliente_dado_de_alta: [darDeAltaClienteProceso, "ABIERTO"],

            alta_cancelada: "ABIERTO",
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
