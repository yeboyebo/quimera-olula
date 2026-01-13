import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoFactura, EstadoFactura } from "./diseño.ts";
import {
    borrarFactura,
    cancelarCambioFactura,
    cargarContexto,
    getContextoVacio,
    refrescarFactura,
    refrescarLineas
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoFactura, ContextoFactura> = () => {

    return {

        INICIAL: {

            factura_id_cambiado: [cargarContexto],

            factura_deseleccionada: [
                getContextoVacio,
                publicar('factura_deseleccionada', null)
            ]
        },

        CONSULTANDO: {

            linea_cargada: [
                refrescarFactura,
                refrescarLineas
            ],

            factura_cargada: ["CONSULTANDO"],

            borrar_solicitado: "BORRANDO_FACTURA",

            factura_cambiada: [refrescarFactura],

            edicion_de_factura_cancelada: [cancelarCambioFactura],
        },

        BORRANDO_FACTURA: {

            borrado_de_factura_listo: borrarFactura,

            borrar_cancelado: "CONSULTANDO",
        },

    }
}
