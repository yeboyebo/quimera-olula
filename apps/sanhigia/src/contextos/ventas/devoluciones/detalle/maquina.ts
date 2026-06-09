import { Maquina } from "@olula/lib/diseño.js";
import {
    ContextoDetalleDevolucionPedido,
    EstadoDetalleDevolucionPedido,
} from "./diseño.ts";
import {
    cargarDetalleDevolucionPedido,
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
        devolucion_preparada: prepararDetalleDevolucionPedido,
    },
});
