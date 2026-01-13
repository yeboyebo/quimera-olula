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

            cambio_cliente_listo: cambiarCliente,

            albaran_cargado: [abiertoOFacturado],

            albaran_cambiado: [refrescarAlbaran],

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

            cambio_cliente_listo: cambiarCliente,

            cambio_cliente_cancelado: "ABIERTO",
        },

        CREANDO_LINEA: {

            alta_de_linea_lista: crearLinea,

            alta_de_linea_cancelada: "ABIERTO",
        },

        CAMBIANDO_LINEA: {

            cambio_de_linea_listo: cambiarLinea,

            cambio_de_linea_cancelado: "ABIERTO",
        },

        BORRANDO_LINEA: {

            borrado_de_linea_listo: borrarLinea,

            borrado_de_linea_cancelado: "ABIERTO",
        },

    }
}
