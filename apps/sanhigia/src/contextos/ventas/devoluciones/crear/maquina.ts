import { Maquina } from "@olula/lib/diseño.js";
import { ContextoCrearDevolucion, EstadoCrearDevolucion } from "./diseño.ts";
import { buscarFacturaProceso, limpiarFacturaProceso } from "./dominio.ts";

export const getMaquina = (): Maquina<EstadoCrearDevolucion, ContextoCrearDevolucion> => ({
    INICIAL: {
        factura_buscada: buscarFacturaProceso,
        formulario_limpiado: limpiarFacturaProceso,
    },
});
