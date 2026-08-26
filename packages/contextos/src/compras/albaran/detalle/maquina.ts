import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import {
    cambiarProveedor,
    cargarContexto,
    limpiarContexto,
    Lineas,
    onLineaBorrada,
    onLineaCambiada,
    onLineaCreada,
    refrescarAlbaran,
} from "./detalle.ts";
import { ContextoDetalleAlbaran, EstadoDetalleAlbaran } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleAlbaran, ContextoDetalleAlbaran> = () => {
    return {
        INICIAL: {
            albaran_id_cambiado: [cargarContexto],

            albaran_deseleccionado: [
                limpiarContexto,
                publicar('albaran_deseleccionado', null),
            ],
        },

        ABIERTO: {
            albaran_id_cambiado: [cargarContexto],

            albaran_guardado: [refrescarAlbaran],

            albaran_deseleccionado: [
                limpiarContexto,
                publicar('albaran_deseleccionado', null),
            ],

            borrado_solicitado: "BORRANDO",

            cambio_proveedor_solicitado: "CAMBIANDO_PROVEEDOR",

            linea_seleccionada: [Lineas.activar],
            alta_linea_solicitada: "CREANDO_LINEA",
            cambio_linea_solicitado: "CAMBIANDO_LINEA",
            baja_linea_solicitada: "BORRANDO_LINEA",
        },

        CAMBIANDO_PROVEEDOR: {
            cambio_proveedor_listo: [cambiarProveedor],
            cambio_proveedor_cancelado: "ABIERTO",
        },

        BORRANDO: {
            albaran_borrado: [
                publicar<EstadoDetalleAlbaran, ContextoDetalleAlbaran>(
                    'albaran_borrado',
                    (contexto) => contexto.albaran.id
                ),
                limpiarContexto,
            ],

            borrado_cancelado: "ABIERTO",
        },

        CREANDO_LINEA: {
            linea_creada: [onLineaCreada, "ABIERTO"],
            alta_de_linea_cancelada: "ABIERTO",
        },

        CAMBIANDO_LINEA: {
            linea_cambiada: [onLineaCambiada, "ABIERTO"],
            cambio_de_linea_cancelado: "ABIERTO",
        },

        BORRANDO_LINEA: {
            linea_borrada: [onLineaBorrada, "ABIERTO"],
            borrado_de_linea_cancelado: "ABIERTO",
        },
    };
};
