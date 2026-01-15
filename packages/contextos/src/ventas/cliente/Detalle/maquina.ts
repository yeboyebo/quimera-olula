import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import {
    abiertoContexto,
    cambiarCliente,
    cancelarCambioCliente,
    cargarContexto,
    getContextoVacio,
    refrescarCliente,
} from "../dominio.ts";
import { ContextoDetalleCliente, EstadoDetalleCliente } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleCliente, ContextoDetalleCliente> = () => {
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

            creacion_solicitada: "CREANDO_CLIENTE",

            baja_solicitada: "BAJANDO_CLIENTE",

            borrado_solicitado: "BORRANDO_CLIENTE",
        },

        CREANDO_CLIENTE: {
            cliente_creado: "ABIERTO",

            creacion_cancelada: "ABIERTO",
        },

        BAJANDO_CLIENTE: {
            cliente_dado_de_baja: "ABIERTO",

            baja_cancelada: "ABIERTO",
        },

        BORRANDO_CLIENTE: {
            cliente_borrado: "ABIERTO",

            borrado_cancelado: "ABIERTO",
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
