import { Maquina } from "@olula/lib/diseño.js";
import {
    ContextoDetalleDevolucionPedido,
    EstadoDetalleDevolucionPedido,
} from "./diseño.ts";
import {
    cambiarCantidadKoDetalleDevolucionPedido,
    cambiarCantidadOkDetalleDevolucionPedido,
    cargarDetalleDevolucionPedido,
    limpiarCantidadesDetalleDevolucionPedido,
    prepararDetalleDevolucionPedido,
} from "./dominio.ts";

export const getMaquina = (): Maquina<
    EstadoDetalleDevolucionPedido,
    ContextoDetalleDevolucionPedido
> => ({
    INICIAL: {
        id_cambiado: cargarDetalleDevolucionPedido,
    },
    ABIERTO: {
        id_cambiado: cargarDetalleDevolucionPedido,
        cantidad_ok_cambiada: cambiarCantidadOkDetalleDevolucionPedido,
        cantidad_ko_cambiada: cambiarCantidadKoDetalleDevolucionPedido,
        cantidades_limpiadas: limpiarCantidadesDetalleDevolucionPedido,
        devolucion_preparada: prepararDetalleDevolucionPedido,
    },
});
