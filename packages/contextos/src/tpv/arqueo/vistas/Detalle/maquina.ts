import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoArqueoTpv, EstadoArqueoTpv } from "./diseño.ts";
import {
    cargarContexto,
    cerrarArqueo,
    getContextoVacio,
    reabrirArqueo
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoArqueoTpv, ContextoArqueoTpv> = () => {

    return {

        INICIAL: {

            id_arqueo_cambiado: [cargarContexto],

            arqueo_deseleccionado: [
                getContextoVacio,
                publicar('arqueo_deseleccionado', null)
            ]
        },

        ABIERTO: {

            borrar_solicitado: "BORRANDO_ARQUEO",

            recuento_solicitado: "RECONTANDO",

            cierre_solicitado: "CERRANDO",
        },

        CERRADO: {

            reapertura_solicitada: "REABRIENDO",
        },

        BORRANDO_ARQUEO: {},

        RECONTANDO: {},

        CERRANDO: {

            cierre_cancelado: "ABIERTO",

            cierre_listo: cerrarArqueo,

        },

        REABRIENDO: {

            reapertura_cancelada: "CERRADO",

            reapertura_lista: [reabrirArqueo, "ABIERTO"],

        },
    }
}