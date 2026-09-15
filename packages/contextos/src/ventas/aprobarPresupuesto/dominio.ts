import { Orden } from "@olula/lib/diseño.ts";
import { LineaAprobarPresupuesto, LineaPedidoPatch } from "./diseño.ts";

/** Orden con el que el servidor devuelve las líneas de esta pantalla. */
export const ordenLineas: Orden = ["referencia", "ASC", "id", "ASC"];

export const pendienteDeLinea = (linea: LineaAprobarPresupuesto): number => {
    if (linea.cerrada) return 0;
    return Math.max(0, linea.cantidad - linea.aprobada);
};

export const lineaCompleta = (linea: LineaAprobarPresupuesto): boolean => {
    return linea.cantidad > 0 && linea.a_aprobar + linea.aprobada >= linea.cantidad;
};

export const transformarLineasPedido = (lineas: LineaAprobarPresupuesto[]): LineaPedidoPatch[] => {
    return lineas
        .map<LineaPedidoPatch>(linea => ({
            id: linea.id,
            cantidad: linea.a_aprobar,
        }))
        .filter(linea => linea.cantidad > 0);
};
