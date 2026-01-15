import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoCliente, EstadoCliente } from "./diseño.ts";
import {
    abiertoContexto,
    borrarCliente,
    cambiarCliente,
    cancelarCambioCliente,
    cargarContexto,
    darDeAltaClienteProceso,
    darDeBajaClienteProceso,
    getContextoVacio,
    refrescarCliente,
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoCliente, ContextoCliente> = () => {

    return {

        INICIAL: {

            cliente_id_cambiado: [cargarContexto],

            cliente_deseleccionado: [
                getContextoVacio,
                publicar('cliente_deseleccionado', null)
            ],
        },

        ABIERTO: {

            cliente_cargado: [abiertoContexto],

            cliente_cambiado: [refrescarCliente],

            edicion_de_cliente_lista: [cambiarCliente],

            edicion_de_cliente_cancelada: [cancelarCambioCliente],

            dar_de_alta_solicitado: [darDeAltaClienteProceso],

            confirmar_baja_solicitado: "CONFIRMANDO_BAJA",

            borrar_solicitado: "BORRANDO_CLIENTE",

            baja_cancelada: "ABIERTO",
        },

        CONFIRMANDO_BAJA: {

            dar_de_baja_solicitado: [darDeBajaClienteProceso, "ABIERTO"],

            baja_cancelada: "ABIERTO",
        },

        EDITANDO_CLIENTE: {

            edicion_de_cliente_lista: [cambiarCliente],

            edicion_de_cliente_cancelada: [cancelarCambioCliente],
        },

        GUARDANDO_CLIENTE: {

            cliente_guardado: [refrescarCliente, "ABIERTO"],

            guardado_cancelado: "ABIERTO",
        },

        BORRANDO_CLIENTE: {

            borrado_de_cliente_listo: borrarCliente,

            borrar_cancelado: "ABIERTO",
        },
    }
}
