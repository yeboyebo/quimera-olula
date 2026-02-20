import { Maquina } from "@olula/lib/diseño.js";
import { ContextoCuentasBanco, EstadoCuentasBanco } from "./diseño.ts";
import {
    Cuentas,
    desmarcarDomiciliacionProceso,
    domiciliarCuentaProceso,
    recargarCuentas,
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoCuentasBanco, ContextoCuentasBanco> = () => {

    return {

        lista: {
            cargar_cuentas: recargarCuentas,

            alta_solicitada: "alta",

            edicion_solicitada: "edicion",

            cuenta_seleccionada: Cuentas.activar,

            borrado_solicitado: "confirmar_borrado",

            domiciliar_solicitada: domiciliarCuentaProceso,

            desmarcar_domiciliacion: desmarcarDomiciliacionProceso,
        },

        alta: {
            cuenta_creada: [recargarCuentas, "lista"],

            alta_cancelada: "lista",
        },

        edicion: {
            cuenta_actualizada: [Cuentas.cambiar, recargarCuentas, "lista"],

            edicion_cancelada: "lista",
        },

        confirmar_borrado: {
            cuenta_borrada: [Cuentas.quitar, "lista"],

            borrado_cancelado: "lista",
        },
    }
}
