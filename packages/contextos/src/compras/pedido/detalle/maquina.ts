import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import {
    cargarContexto,
    cerrarLineaProceso,
    limpiarContexto,
    Lineas,
    onLineaBorrada,
    onLineaCambiada,
    onLineaCreada,
    refrescarPedido,
} from "./detalle.ts";
import { ContextoDetallePedido, EstadoDetallePedido } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetallePedido, ContextoDetallePedido> = () => {
    return {
        INICIAL: {
            pedido_id_cambiado: [cargarContexto],

            pedido_deseleccionado: [
                limpiarContexto,
                publicar('pedido_deseleccionado', null),
            ],
        },

        ABIERTO: {
            pedido_id_cambiado: [cargarContexto],

            pedido_guardado: [refrescarPedido],

            pedido_deseleccionado: [
                limpiarContexto,
                publicar('pedido_deseleccionado', null),
            ],

            borrado_solicitado: "BORRANDO",

            linea_seleccionada: [Lineas.activar],
            alta_linea_solicitada: "CREANDO_LINEA",
            cambio_linea_solicitado: "CAMBIANDO_LINEA",
            baja_linea_solicitada: "BORRANDO_LINEA",
            cierre_linea_solicitado: [cerrarLineaProceso],
        },

        BORRANDO: {
            pedido_borrado: [
                publicar<EstadoDetallePedido, ContextoDetallePedido>(
                    'pedido_borrado',
                    (contexto) => contexto.pedido.id
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
