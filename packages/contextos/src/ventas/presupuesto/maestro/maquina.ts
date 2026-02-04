import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroPresupuesto, EstadoMaestroPresupuesto } from "./diseño.ts";
import {
    Presupuestos,
    recargarPresupuestos
} from "./dominio.ts";


export const getMaquina: () => Maquina<EstadoMaestroPresupuesto, ContextoMaestroPresupuesto> = () => {

    return {

        INICIAL: {

            presupuesto_cambiado: Presupuestos.cambiar,

            presupuesto_seleccionado: [Presupuestos.activar],

            presupuesto_deseleccionado: Presupuestos.desactivar,

            presupuesto_borrado: Presupuestos.quitar,

            presupuesto_creado: Presupuestos.incluir,

            recarga_de_presupuestos_solicitada: recargarPresupuestos,

            crear_presupuesto_solicitado: 'CREANDO_PRESUPUESTO',
        },

        CREANDO_PRESUPUESTO: {

            presupuesto_creado: [Presupuestos.incluir, 'INICIAL'],

            creacion_presupuesto_cancelada: 'INICIAL',
        },
    }
}
