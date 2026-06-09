import { ProcesarContexto } from "@olula/lib/diseño.ts";
import {
    getDevolucionPedido,
    getLineasDevolucionPedido,
    prepararDevolucionPedido,
} from "../infraestructura.ts";
import {
    ContextoDetalleDevolucionPedido,
    EstadoDetalleDevolucionPedido,
    contextoDetalleDevolucionPedidoVacio,
} from "./diseño.ts";

export type ProcesarDetalleDevolucionPedido = ProcesarContexto<
    EstadoDetalleDevolucionPedido,
    ContextoDetalleDevolucionPedido
>;

export const cargarDetalleDevolucionPedido: ProcesarDetalleDevolucionPedido = async (_contexto, payload) => {
    const idPedido = String(payload ?? "");

    if (!idPedido) {
        return contextoDetalleDevolucionPedidoVacio;
    }

    try {
        const [devolucion, lineas] = await Promise.all([
            getDevolucionPedido(idPedido),
            getLineasDevolucionPedido(idPedido),
        ]);

        return {
            estado: "ABIERTO",
            devolucion,
            lineas,
            error: "",
        };
    } catch (error) {
        return {
            ...contextoDetalleDevolucionPedidoVacio,
            error: "No se ha podido cargar la devolución.",
        };
    }
};

export const prepararDetalleDevolucionPedido: ProcesarDetalleDevolucionPedido = async (contexto) => {
    if (!contexto.devolucion) {
        return contexto;
    }

    const devolucionPreparada = await prepararDevolucionPedido({
        idPedido: contexto.devolucion.id,
        lineasDevolucion: contexto.lineas,
    });

    return [
        {
            ...contexto,
            devolucion: devolucionPreparada,
        },
        [["devolucion_actualizada", devolucionPreparada]],
    ];
};
