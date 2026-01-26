import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { cambiarOportunidad, cargarContexto, getContextoVacio, onOportunidadBorrada } from "./detalle.ts";
import { ContextoDetalleOportunidad, EstadoDetalleOportunidad } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleOportunidad, ContextoDetalleOportunidad> = () => {
    return {
        INICIAL: {
            oportunidad_id_cambiado: cargarContexto,

            oportunidad_cambiada: cambiarOportunidad,

            edicion_oportunidad_cancelada: [getContextoVacio, publicar("oportunidad_deseleccionada", null)],

            borrado_oportunidad_solicitado: "BORRANDO",
        },
        BORRANDO: {
            borrado_oportunidad_cancelado: "INICIAL",

            oportunidad_borrada: onOportunidadBorrada,
        },
    }
}
