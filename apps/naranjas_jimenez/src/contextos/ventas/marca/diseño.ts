import { Filtro, Orden } from "@olula/lib/diseño.js";


export type ItemListaMarca = {
    id: string;
    descripcion: string;
};


export type GetItemsListaMarca = (filtro: Filtro, orden: Orden) => Promise<ItemListaMarca[]>;
