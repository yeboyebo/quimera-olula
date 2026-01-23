import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoAlbaran, EstadoAlbaran } from "./diseño.ts";
import {
    abiertoOFacturado,
    activarLinea,
    borrarAlbaran,
    borrarLinea,
    cambiarAlbaran,
    cambiarCantidadLinea,
    cambiarCliente,
    cambiarLinea,
    cancelarCambioAlbaran,
    cargarContexto,
    crearLinea,
    getContextoVacio,
    refrescarAlbaran,
    refrescarLineas
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoAlbaran, ContextoAlbaran> = () => {

    return {

        INICIAL: {

            albaran_id_cambiado: [cargarContexto],

            albaran_deseleccionado: [
                getContextoVacio,
                publicar('albaran_deseleccionado', null)
            ]
        },

        ABIERTO: {

            linea_creada: [
                refrescarAlbaran,
                refrescarLineas
            ],

            alta_linea_solicitada: "CREANDO_LINEA",

            baja_linea_solicitada: "BORRANDO_LINEA",

            cambio_linea_solicitado: "CAMBIANDO_LINEA",

            borrar_solicitado: "BORRANDO_ALBARAN",

            cambio_cliente_solicitado: "CAMBIANDO_CLIENTE",

            albaran_cargado: [abiertoOFacturado],

            albaran_cambiado: [refrescarAlbaran, "ABIERTO"],

            edicion_de_albaran_lista: [cambiarAlbaran],

            edicion_de_albaran_cancelada: [cancelarCambioAlbaran],

            linea_seleccionada: [activarLinea],

            cliente_cambiado: [cambiarCliente],

            cambio_cantidad_linea_solicitado: cambiarCantidadLinea,
        },

        FACTURADO: {

            albaran_cargado: [abiertoOFacturado],
        },

        BORRANDO_ALBARAN: {

            borrado_de_albaran_listo: borrarAlbaran,

            borrar_cancelado: "ABIERTO",
        },

        CAMBIANDO_CLIENTE: {

            cambio_cliente_listo: [cambiarCliente, "ABIERTO"],

            cambio_cliente_cancelado: "ABIERTO",
        },

        CREANDO_LINEA: {

            alta_linea_lista: [crearLinea],

            crear_linea_cancelado: "ABIERTO",
        },

        CAMBIANDO_LINEA: {

            linea_actualizada: cambiarLinea,

            editar_linea_cancelado: "ABIERTO",
        },

        BORRANDO_LINEA: {

            linea_borrada: borrarLinea,

            borrar_linea_cancelado: "ABIERTO",
        },

    }
}
