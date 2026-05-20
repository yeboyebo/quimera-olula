import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoCaja, EstadoCaja } from "./diseño.ts";
import {
    borrarCajaContexto,
    cambiarCaja,
    cancelarCambioCaja,
    cargarContexto,
    getContextoVacio,
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoCaja, ContextoCaja> = () => ({
    INICIAL: {
        caja_id_cambiado: [cargarContexto],

        caja_deseleccionada: [
            getContextoVacio,
            publicar("caja_deseleccionada", null),
        ],
    },
    ABIERTO: {
        caja_deseleccionada: [
            getContextoVacio,
            publicar("caja_deseleccionada", null),
        ],

        edicion_de_caja_lista: [cambiarCaja],

        edicion_de_caja_cancelada: [cancelarCambioCaja],

        borrado_solicitado: "BORRANDO_CAJA",
    },
    BORRANDO_CAJA: {
        borrado_cancelado: "ABIERTO",

        caja_borrada: borrarCajaContexto,
    },
});
