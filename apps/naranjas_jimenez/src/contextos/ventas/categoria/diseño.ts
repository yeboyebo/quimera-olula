import { Filtro, Orden } from "@olula/lib/diseño.js";


export type ItemListaCategoria = {
    id: string;
    descripcion: string;
};


export type GetItemsListaCategoria = (filtro: Filtro, orden: Orden) => Promise<ItemListaCategoria[]>;
