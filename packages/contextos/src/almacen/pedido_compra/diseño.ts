import { Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";

export type TipoOrden = "ENTRADA" | "SALIDA" | "TRASPASO";

export interface ItemPedidoCompra extends Entidad {
    id: string;
    fecha: Date;
    proveedor: string;
    codigo: string;
}


export type GetPedidos = (filtro: Filtro, orden: Orden, paginacion?: Paginacion) => RespuestaLista<ItemPedidoCompra>;
