import { Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.js";

export interface ArqueoTpv extends Entidad {
    id: string;
    fechahora_inicio: Date;
    fechahora_fin: Date | null;
    abierto: boolean;
}

export type GetArqueoTpv = (id: string) => Promise<ArqueoTpv>;

export type GetArqueosTpv = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<ArqueoTpv>;


