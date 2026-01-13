import { Maquina } from "@olula/lib/diseño.js";
import {
    activarDireccion,
    actualizarDireccion,
    borrarDireccion,
    cancelarAlta,
    cancelarConfirmacion,
    cancelarEdicion,
    cargarDirecciones,
    marcarDireccionFacturacion,
} from "./dominio.ts";
import { ContextoDirecciones, EstadoDirecciones } from "./tipos.ts";

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
            direccion_creada: [cargarDirecciones, "lista"],

            alta_cancelada: cancelarAlta,
        },

        edicion: {
            direccion_actualizada: [actualizarDireccion, "lista"],

            edicion_cancelada: cancelarEdicion,
        },

        confirmar_borrado: {
            borrado_confirmado: borrarDireccion,

            borrado_cancelado: cancelarConfirmacion,
        },
    }
}
