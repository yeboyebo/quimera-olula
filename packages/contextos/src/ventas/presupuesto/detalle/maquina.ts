import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoPresupuesto, EstadoPresupuesto } from "./diseño.ts";
import {
    abiertoOAprobadoContexto,
    activarLinea,
    aprobarPresupuesto,
    borrarLinea,
    borrarPresupuesto,
    cambiarCantidadLinea,
    cambiarCliente,
    cambiarDivisa,
    cambiarLinea,
    cambiarPresupuesto,
    cancelarCambioPresupuesto,
    cargarContexto,
    crearLinea,
    getContextoVacio,
    refrescarLineas,
    refrescarPresupuesto
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoPresupuesto, ContextoPresupuesto> = () => {

    return {

        INICIAL: {

            presupuesto_id_cambiado: [cargarContexto],

            presupuesto_deseleccionado: [
                getContextoVacio,
                publicar('presupuesto_deseleccionado', null)
            ],
        },

        ABIERTO: {

            linea_creada: [
                refrescarPresupuesto,
                refrescarLineas
            ],

            alta_linea_solicitada: "CREANDO_LINEA",

            baja_linea_solicitada: "BORRANDO_LINEA",

            cambio_linea_solicitado: "CAMBIANDO_LINEA",

            borrar_solicitado: "BORRANDO_PRESUPUESTO",

            aprobacion_solicitada: "APROBANDO_PRESUPUESTO",

            cambio_divisa_solicitado: "CAMBIANDO_DIVISA",

            cambio_cliente_listo: cambiarCliente,

            presupuesto_cargado: [abiertoOAprobadoContexto],

            presupuesto_cambiado: [refrescarPresupuesto],

            edicion_de_presupuesto_lista: [cambiarPresupuesto],

            edicion_de_presupuesto_cancelada: [cancelarCambioPresupuesto],

            linea_seleccionada: [activarLinea],

            cliente_cambiado: [cambiarCliente],

            cambio_cantidad_linea_solicitado: cambiarCantidadLinea,
        },

        APROBADO: {

            presupuesto_cargado: [abiertoOAprobadoContexto],
        },

        BORRANDO_PRESUPUESTO: {

            borrado_de_presupuesto_listo: borrarPresupuesto,

            borrar_cancelado: "ABIERTO",
        },

        APROBANDO_PRESUPUESTO: {

            aprobacion_lista: aprobarPresupuesto,

            aprobacion_cancelada: "ABIERTO",
        },

        CAMBIANDO_DIVISA: {

            cambio_divisa_listo: cambiarDivisa,

            cambio_divisa_cancelado: "ABIERTO",
        },

        CAMBIANDO_CLIENTE: {

            cambio_cliente_listo: cambiarCliente,

            cambio_cliente_cancelado: "ABIERTO",
        },

        CREANDO_LINEA: {

            linea_creada: crearLinea,

            alta_de_linea_cancelada: "ABIERTO",
        },

        CAMBIANDO_LINEA: {

            linea_actualizada: cambiarLinea,

            cambio_de_linea_cancelado: "ABIERTO",
        },

        BORRANDO_LINEA: {

            linea_borrada: borrarLinea,

            borrado_de_linea_cancelado: "ABIERTO",
        },

    }
}
