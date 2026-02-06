import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroAlbaran, EstadoMaestroAlbaran } from "./diseño.ts";
import {
    activarAlbaran,
    cambiarAlbaranEnLista,
    desactivarAlbaranActivo,
    incluirAlbaranEnLista,
    quitarAlbaranDeLista,
    recargarAlbaranes
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoMaestroAlbaran, ContextoMaestroAlbaran> = () => {

    return {

        INICIAL: {

            albaran_cambiado: cambiarAlbaranEnLista,

            albaran_seleccionado: [activarAlbaran],

            albaran_deseleccionado: desactivarAlbaranActivo,

            albaran_borrado: quitarAlbaranDeLista,

            albaran_creado: incluirAlbaranEnLista,

            recarga_de_albaranes_solicitada: recargarAlbaranes,

            crear_albaran_solicitado: "CREANDO_ALBARAN",
        },

        CREANDO_ALBARAN: {

            albaran_creado: [incluirAlbaranEnLista, 'INICIAL'],

            creacion_cancelada: "INICIAL",
        },
    }
}
