import { Maquina } from "@olula/lib/diseño.js";
import { ContextoArqueoTpv, EstadoArqueoTpv } from "./diseño.ts";
import {
    cargarContexto,
    getContextoVacio
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoArqueoTpv, ContextoArqueoTpv> = () => {

    return {

        INICIAL: {

            id_arqueo_cambiado: [cargarContexto],

            arqueo_deseleccionado: [
                getContextoVacio,
                // publicar('arqueo_deseleccionado', null)
            ]
        },

        ABIERTO: {

            borrar_solicitado: "BORRANDO_ARQUEO",

            recuento_solicitado: "RECONTANDO",

            cierre_solicitado: "CERRANDO",
        },

        CERRADO: {

        },

        BORRANDO_ARQUEO: {},

        RECONTANDO: {},

        CERRANDO: {},
    }
}