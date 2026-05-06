import { Filtro, Orden } from "@olula/lib/diseño.js";

export type ItemListaTransportista = {
    id: string;
    descripcion: string;
};


export type GetItemsListaTransportista = (filtro: Filtro, orden: Orden) => Promise<ItemListaTransportista[]>;