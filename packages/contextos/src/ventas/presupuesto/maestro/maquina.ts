import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroPresupuesto, EstadoMaestroPresupuesto } from "./diseño.ts";
import {
    abrirModalCreacion,
    activarPresupuesto,
    cambiarPresupuestoEnLista,
    cerrarModalCreacion,
    desactivarPresupuestoActivo,
    incluirPresupuestoEnLista,
    quitarPresupuestoDeLista,
    recargarPresupuestos
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoMaestroPresupuesto, ContextoMaestroPresupuesto> = () => {

    return {

        INICIAL: {

            presupuesto_cambiado: cambiarPresupuestoEnLista,

            presupuesto_seleccionado: [activarPresupuesto],

            presupuesto_deseleccionado: desactivarPresupuestoActivo,

            presupuesto_borrado: quitarPresupuestoDeLista,

            presupuesto_creado: incluirPresupuestoEnLista,

            recarga_de_presupuestos_solicitada: recargarPresupuestos,

            crear_presupuesto_solicitado: abrirModalCreacion,
        },

        CREANDO_PRESUPUESTO: {

            presupuesto_creado: [incluirPresupuestoEnLista, 'INICIAL'],

            creacion_presupuesto_cancelada: cerrarModalCreacion,
        },
    }
}
