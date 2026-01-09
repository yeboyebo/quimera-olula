import { Entidad } from "@olula/lib/diseño.js";
import { LineaVenta } from "../venta/diseño.ts";

export interface LineaAlbaranarPedido extends LineaVenta {
    servida?: number;
    a_enviar?: number;
    tramos?: Tramo[];
}

export interface Tramo extends Entidad {
    lote_id?: string;
    ubicacion_id?: string;
    cantidad: number;
    cantidad_ko?: number;
};

export interface LineasAlabaranPatch {
    id: string;
    cantidad: number;
    lotes?: [];
}

export type PatchAlbaranarPedido = (id: string, lineas: LineaAlbaranarPedido[]) => Promise<void>;