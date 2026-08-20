import { LineaVenta } from "../venta/diseño.ts";

export interface LineaAprobarPresupuesto extends LineaVenta {
    servida?: number;
    cerrada?: boolean;
    a_pedir?: number;
}

export interface LineaPedidoPatch {
    id: string;
    cantidad: number;
}

export type PedidoCreado = {
    id: string;
    codigo: string;
};

export type PatchAprobarPresupuestoParcial = (id: string, lineas: LineaAprobarPresupuesto[]) => Promise<PedidoCreado>;

export type PatchCerrarLineaPresupuesto = (presupuestoId: string, lineaId: string, cerrada: boolean) => Promise<void>;
