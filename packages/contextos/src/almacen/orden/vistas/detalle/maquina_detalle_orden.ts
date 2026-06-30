import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { activarLineaParaBorrar, cargarOrden, ContextoOrdenAlmacen, EstadoOrdenAlmacen, refrescarOrden } from "./detalle.ts";

export const getMaquina: () => Maquina<EstadoOrdenAlmacen, ContextoOrdenAlmacen> = () => {

    return {

        INICIAL: {
            orden_id_cambiada: [cargarOrden],
        },

        ABIERTA: {
            borrar: "BORRANDO",
            orden_guardada: [refrescarOrden],
            lectura_registrada: [refrescarOrden],
            borrado_linea_solicitado: activarLineaParaBorrar,
        },

        BORRANDO: {
            borrado_cancelado: "ABIERTA",
            orden_borrada: publicar("orden_borrada"),
        },

        BORRANDO_LINEA: {
            linea_orden_borrada: [refrescarOrden, "ABIERTA"],
            borrado_cancelado: "ABIERTA",
        },
    }
}
