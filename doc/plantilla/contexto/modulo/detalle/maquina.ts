import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { ContextoDetalleModulo, EstadoDetalleModulo } from "./diseño.ts";
import {
    cancelarEdicion,
    entrarEnEdicion,
    guardarModulo,
} from "./dominio.ts";

/**
 * Máquina de estados para la vista detalle
 * Define transiciones entre estados y qué acciones ejecutar
 */
export const getMaquina: () => Maquina<EstadoDetalleModulo, ContextoDetalleModulo> = () => {
    return {
        INICIAL: {
            // Cuando se carga el módulo
            modulo_cargado: "ABIERTO",

            // Cuando se deselecciona
            modulo_deseleccionado: [
                publicar("modulo_deseleccionado", null),
            ],
        },

        ABIERTO: {
            // Entrar en edición
            edicion_solicitada: ["EDITANDO", entrarEnEdicion],
        },

        EDITANDO: {
            // Guardar cambios
            guardar_solicitado: ["GUARDANDO", guardarModulo],

            // Cancelar sin guardar
            cancelar_solicitado: [cancelarEdicion, "ABIERTO"],
        },

        GUARDANDO: {
            // Cambios guardados correctamente
            modulo_guardado: "ABIERTO",

            // Error al guardar
            error_guardado: "EDITANDO",
        },
    };
};
