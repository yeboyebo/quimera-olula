import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { LineaOrdenAlmacen, OrdenAlmacen } from "../../diseño.ts";
import {
    cargarContexto,
    Lineas,
    onLineaBorrada,
    onLineaCambiada,
    onLineaCreada,
    refrescarOrden,
} from "./detalle.ts";

export type EstadoOrdenAlmacen =
    | 'INICIAL'
    | 'ABIERTA'
    | 'BORRANDO'
    | 'CREANDO_LINEA'
    | 'CAMBIANDO_LINEA'
    | 'BORRANDO_LINEA';

export type ContextoOrdenAlmacen = {
    estado: EstadoOrdenAlmacen;
    orden: OrdenAlmacen;
    lineas: ListaEntidades<LineaOrdenAlmacen>;
};

export const getMaquina: () => Maquina<EstadoOrdenAlmacen, ContextoOrdenAlmacen> = () => {
    return {
        INICIAL: {
            orden_id_cambiada: [cargarContexto],
        },

        ABIERTA: {
            orden_guardada: [refrescarOrden],
            lectura_registrada: [refrescarOrden],
            borrado_solicitado: "BORRANDO",
            orden_id_cambiada: [cargarContexto],
            alta_linea_solicitada: "CREANDO_LINEA",
            cambio_linea_solicitado: "CAMBIANDO_LINEA",
            baja_linea_solicitada: "BORRANDO_LINEA",
            linea_seleccionada: [Lineas.activar],
        },

        BORRANDO: {
            orden_borrada: [
                publicar('orden_borrada', null),
                "INICIAL",
            ],
            borrado_cancelado: "ABIERTA",
        },

        CREANDO_LINEA: {
            linea_creada: [onLineaCreada, "ABIERTA"],
            alta_de_linea_cancelada: "ABIERTA",
        },

        CAMBIANDO_LINEA: {
            linea_cambiada: [onLineaCambiada, "ABIERTA"],
            cambio_de_linea_cancelado: "ABIERTA",
        },

        BORRANDO_LINEA: {
            linea_borrada: [onLineaBorrada, "ABIERTA"],
            borrado_de_linea_cancelado: "ABIERTA",
        },
    };
};
