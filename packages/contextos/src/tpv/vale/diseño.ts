import { Entidad } from "@olula/lib/diseño.js";

export interface ValeTpv extends Entidad {
    saldo_inicial: number;
    saldo_consumido: number;
    saldo_pendiente: number;
}

export type GetValeTpv = (id: string) => Promise<ValeTpv>;
