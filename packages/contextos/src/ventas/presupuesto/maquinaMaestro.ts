import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroPresupuesto, EstadoMaestroPresupuesto } from "./diseño.ts";
import {
    activarPresupuesto,
    cambiarPresupuestoEnLista,
    crearPresupuesto,
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

            creacion_de_presupuesto_solicitada: crearPresupuesto,
        },
    }
}