import { Maquina } from "@olula/lib/diseño.js";
import { ContextoAprobarPresupuesto, EstadoAprobarPresupuesto } from "./diseño.ts";
import {
    actualizarEstadoCerradoLinea,
    aprobarLinea,
    aprobarPresupuesto,
    aprobarTodas,
    cambiarCantidadLinea,
    cancelarSeleccion,
    cargarDatos,
    seleccionarLinea
} from "./dominio.ts";

export const getMaquina: () => Maquina<EstadoAprobarPresupuesto, ContextoAprobarPresupuesto> = () => {
    return {
        INICIAL: {
            cargar: [cargarDatos],
        },

        VACIO: {},

        CARGANDO: {},

        LISTO: {
            linea_seleccionada: seleccionarLinea,

            cantidad_cambiada: cambiarCantidadLinea,

            linea_aprobada: aprobarLinea,

            todas_las_lineas_aprobadas: aprobarTodas,

            linea_cerrada_actualizada: actualizarEstadoCerradoLinea,

            seleccion_cancelada: cancelarSeleccion,

            aprobacion_solicitada: "CONFIRMANDO_APROBACION",
        },

        CONFIRMANDO_APROBACION: {
            aprobacion_cancelada: "LISTO",

            aprobacion_confirmada: [
                aprobarPresupuesto,
                "PEDIDO_CREADO"
            ],
        },

        PEDIDO_CREADO: {
            pedido_creado_cerrado: "LISTO",
        },
    };
};
