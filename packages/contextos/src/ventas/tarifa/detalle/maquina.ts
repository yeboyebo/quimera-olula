import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import {
    Articulos,
    cargarContexto,
    onArticuloBorrado,
    onArticuloCambiado,
    onArticuloCreado,
    refrescarTarifa,
} from "./detalle.js";
import { ContextoDetalleTarifa, EstadoDetalleTarifa } from "./diseño.js";

/**
 * Máquina de estados para la vista detalle.
 *
 * Patrón de transiciones:
 *   - string                    → transición simple de estado (sin efecto)
 *   - [fn, fn, ...]             → cadena de procesadores (pipe implícito)
 *   - [fn, fn, ..., "ESTADO"]   → pipe + cambio de estado al final
 *   - fn sola                   → procesador directo (puede devolver nuevo estado)
 */
export const getMaquina: () => Maquina<EstadoDetalleTarifa, ContextoDetalleTarifa> = () => {
    return {
        INICIAL: {
            // Cuando llega un nuevo ID (por prop del maestro)
            tarifa_id_cambiada: [cargarContexto],

            // Cuando se deselecciona desde el maestro
            tarifa_deseleccionada: [
                publicar('tarifa_deseleccionada', null),
            ],
        },

        ABIERTO: {
            // Cambio guardado en API (por auto-guardado de useModelo)
            tarifa_guardada: [refrescarTarifa],

            // Activar modal de borrado de la tarifa
            borrado_solicitado: "BORRANDO",

            // El detalle puede recargar la entidad (ej. tras acción externa)
            tarifa_id_cambiada: [cargarContexto],

            // Sub-recurso: artículos de la tarifa
            alta_articulo_solicitada: "CREANDO_ARTICULO",
            cambio_articulo_solicitado: "CAMBIANDO_ARTICULO",
            baja_articulo_solicitada: "BORRANDO_ARTICULO",
            articulo_seleccionado: [Articulos.activar],
        },

        BORRANDO: {
            // El modal confirmó el borrado; notifica al maestro y limpia el contexto
            tarifa_borrada: [
                publicar('tarifa_borrada', null),
                "INICIAL",
            ],

            // El modal canceló
            borrado_de_tarifa_cancelado: "ABIERTO",
        },

        CREANDO_ARTICULO: {
            articulo_creado: [onArticuloCreado, "ABIERTO"],
            alta_de_articulo_cancelada: "ABIERTO",
        },

        CAMBIANDO_ARTICULO: {
            articulo_cambiado: [onArticuloCambiado, "ABIERTO"],
            cambio_de_articulo_cancelado: "ABIERTO",
        },

        BORRANDO_ARTICULO: {
            articulo_borrado: [onArticuloBorrado, "ABIERTO"],
            borrado_de_articulo_cancelado: "ABIERTO",
        },
    };
};
