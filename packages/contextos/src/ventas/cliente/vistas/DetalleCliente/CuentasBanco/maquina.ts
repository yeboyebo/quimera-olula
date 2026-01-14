import { Maquina } from "@olula/lib/diseño.js";
import { ContextoCuentasBanco, EstadoCuentasBanco } from "./diseño.ts";
import {
    activarCuenta,
    actualizarCuenta,
    borrarCuenta,
    cancelarAlta,
    cancelarConfirmacion,
    cancelarEdicion,
    cargarCuentasBanco,
    crearCuenta,
    desmarcarDomiciliacionProceso,
    domiciliarCuentaProceso,
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoCuentasBanco, ContextoCuentasBanco> = () => {

    return {

        lista: {
            cargar_cuentas: cargarCuentasBanco,

            alta_solicitada: "alta",

            edicion_solicitada: "edicion",

            cuenta_seleccionada: activarCuenta,

            borrado_solicitado: "confirmar_borrado",

            domiciliar_solicitada: domiciliarCuentaProceso,

            desmarcar_domiciliacion: desmarcarDomiciliacionProceso,
        },

        alta: {
            crear_cuenta: [crearCuenta, "lista"],

            alta_cancelada: cancelarAlta,
        },

        edicion: {
            actualizar_cuenta: [actualizarCuenta, "lista"],

            edicion_cancelada: cancelarEdicion,
        },

        confirmar_borrado: {
            borrado_confirmado: borrarCuenta,

            borrado_cancelado: cancelarConfirmacion,
        },
    }
}
