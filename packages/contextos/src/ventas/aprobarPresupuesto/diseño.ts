import { LineaPresupuesto } from "../presupuesto/diseño.ts";

/**
 * `aprobada` y `cerrada` vienen del servidor (están en `LineaPresupuesto`);
 * `a_aprobar` es local: solo vive en esta pantalla y viaja como `cantidad` en
 * el payload. Ninguno es opcional: así olvidarse de uno no compila.
 */
export interface LineaAprobarPresupuesto extends LineaPresupuesto {
    a_aprobar: number;
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
