import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { cambiarContacto, cargarContexto, getContextoVacio, onContactoBorrado } from "./detalle.ts";
import { ContextoDetalleContacto, EstadoDetalleContacto } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleContacto, ContextoDetalleContacto> = () => {
    return {
        INICIAL: {
            contacto_id_cambiado: cargarContexto,

            contacto_cambiado: cambiarContacto,

            edicion_contacto_cancelada: [getContextoVacio, publicar("contacto_deseleccionado", null)],

            borrado_contacto_solicitado: "BORRANDO",
        },
        BORRANDO: {
            borrado_contacto_cancelado: "INICIAL",

            contacto_borrado: onContactoBorrado,
        },
    }
}
