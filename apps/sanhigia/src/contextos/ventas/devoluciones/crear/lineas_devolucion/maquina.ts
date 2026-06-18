import { Maquina } from "@olula/lib/diseño.ts";
import {
    ContextoLineasDevolucion,
    EstadoLineasDevolucion,
} from "./diseño.ts";
import {
    aplicarCantidadProceso,
    aplicarDevolucionTotalProceso,
    cambiarBorradorProceso,
    cargarLineasProceso,
} from "./dominio.ts";

export const getMaquina = (): Maquina<
    EstadoLineasDevolucion,
    ContextoLineasDevolucion
> => ({
    INICIAL: {
        lineas_cargadas: cargarLineasProceso,
        borrador_cambiado: cambiarBorradorProceso,
        cantidad_aplicada: aplicarCantidadProceso,
        devolucion_total_aplicada: aplicarDevolucionTotalProceso,
    },
});
