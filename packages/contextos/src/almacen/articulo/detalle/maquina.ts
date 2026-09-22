import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoArticulo, EstadoArticulo } from "./diseño.ts";
import {
    activarCajaProveedor,
    activarProveedorParaCaja,
    alternarCompra,
    alternarVenta,
    borrarArticulo,
    cargarContexto,
    getContextoVacio,
    marcarCajaProveedorDefecto,
    refrescarArticulo,
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoArticulo, ContextoArticulo> = () => ({
    INICIAL: {
        articulo_id_cambiado: [cargarContexto],

        articulo_deseleccionado: [
            getContextoVacio,
            publicar("articulo_deseleccionado", null),
        ],
    },

    ABIERTO: {
        articulo_id_cambiado: [cargarContexto],

        articulo_guardado: [refrescarArticulo],

        venta_alternada_solicitada: [alternarVenta],

        compra_alternada_solicitada: [alternarCompra],

        articulo_deseleccionado: [
            getContextoVacio,
            publicar("articulo_deseleccionado", null),
        ],

        borrado_solicitado: "BORRANDO_ARTICULO",

        alta_caja_proveedor_solicitada: [activarProveedorParaCaja, "CREANDO_CAJA_PROVEEDOR"],
        cambio_caja_proveedor_solicitado: [activarCajaProveedor, "CAMBIANDO_CAJA_PROVEEDOR"],
        baja_caja_proveedor_solicitada: [activarCajaProveedor, "BORRANDO_CAJA_PROVEEDOR"],
        caja_proveedor_defecto_solicitada: [marcarCajaProveedorDefecto],
    },

    BORRANDO_ARTICULO: {
        borrado_de_articulo_listo: borrarArticulo,

        borrado_cancelado: "ABIERTO",
    },

    CREANDO_CAJA_PROVEEDOR: {
        caja_proveedor_creada: [refrescarArticulo, "ABIERTO"],
        alta_de_caja_proveedor_cancelada: "ABIERTO",
    },

    CAMBIANDO_CAJA_PROVEEDOR: {
        caja_proveedor_cambiada: [refrescarArticulo, "ABIERTO"],
        cambio_de_caja_proveedor_cancelado: "ABIERTO",
    },

    BORRANDO_CAJA_PROVEEDOR: {
        caja_proveedor_borrada: [refrescarArticulo, "ABIERTO"],
        borrado_de_caja_proveedor_cancelado: "ABIERTO",
    },
});
