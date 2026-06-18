import { Maquina } from "@olula/lib/diseño.js";
import { ContextoCrearDevolucion, EstadoCrearDevolucion } from "./diseño.ts";
import {
    buscarFacturaProceso,
    limpiarFacturaProceso,
    seleccionarFacturaProceso,
    volverABusquedaProceso,
} from "./dominio.ts";

export const getMaquina = (): Maquina<EstadoCrearDevolucion, ContextoCrearDevolucion> => ({
    SELECCIONANDO_FACTURA: {
        factura_seleccionada: seleccionarFacturaProceso,
        factura_buscada: buscarFacturaProceso,
        formulario_limpiado: limpiarFacturaProceso,
    },

    EDITANDO_DEVOLUCION: {
        volver_a_busqueda: volverABusquedaProceso,
        formulario_limpiado: limpiarFacturaProceso,
    },
});
