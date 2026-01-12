import { Criteria, Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.js";

export interface ArqueoTpv extends Entidad {
    id: string;
    fechahora_inicio: Date;
    fechahora_fin: Date | null;
    abierto: boolean;
    totalEfectivo: number;
    totalTarjeta: number;
    totalVales: number;
}

export interface PagoArqueoTpv extends Entidad {
    id: string;
    importe: number;
    formaPago: string;
    fecha: Date;
    codigoVenta: string;
}

export type GetArqueoTpv = (id: string) => Promise<ArqueoTpv>;

export type GetArqueosTpv = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<ArqueoTpv>;

export type GetPagosArqueoTpv = (id: string, criteria: Criteria) => RespuestaLista<PagoArqueoTpv>;
