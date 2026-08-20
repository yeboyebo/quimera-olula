import { LineaAprobarPresupuesto, LineaPedidoPatch } from "./diseño.ts";

export const pendienteDeLinea = (linea: LineaAprobarPresupuesto): number => {
    if (linea.cerrada) return 0;
    return Math.max(0, linea.cantidad - (linea.servida || 0));
};

export const lineaCompleta = (linea: LineaAprobarPresupuesto): boolean => {
    return linea.cantidad > 0 && (linea.a_pedir || 0) + (linea.servida || 0) >= linea.cantidad;
};

export const transformarLineasPedido = (lineas: LineaAprobarPresupuesto[]): LineaPedidoPatch[] => {
    return lineas
        .map<LineaPedidoPatch>(linea => ({
            id: linea.id,
            cantidad: linea.a_pedir || 0,
        }))
        .filter(linea => linea.cantidad > 0);
};
