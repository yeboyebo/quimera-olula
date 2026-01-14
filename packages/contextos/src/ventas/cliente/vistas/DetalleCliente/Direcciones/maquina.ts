import { Maquina } from "@olula/lib/diseño.js";
import { ContextoDirecciones, EstadoDirecciones } from "./diseño.ts";
import {
    activarDireccion,
    actualizarDireccion,
    borrarDireccion,
    cancelarAlta,
    cancelarConfirmacion,
    cancelarEdicion,
    cargarDirecciones,
    crearDireccion,
    marcarDireccionFacturacion,
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoDirecciones, ContextoDirecciones> = () => {

    return {

        lista: {
            cargar_direcciones: cargarDirecciones,

            alta_solicitada: "alta",

            edicion_solicitada: "edicion",

            direccion_seleccionada: activarDireccion,

            borrado_solicitado: "confirmar_borrado",

            facturacion_solicitada: marcarDireccionFacturacion,
        },

        alta: {
            crear_direccion: [crearDireccion, "lista"],

            alta_cancelada: cancelarAlta,
        },

        edicion: {
            actualizar_direccion: [actualizarDireccion, "lista"],

            edicion_cancelada: cancelarEdicion,
        },

        confirmar_borrado: {
            borrado_confirmado: borrarDireccion,

            borrado_cancelado: cancelarConfirmacion,
        },
    }
}
