import { Filtro, Orden } from "@olula/lib/diseño.js";


export type ItemListaCalibre = {
    id: string;
    descripcion: string;
};


export type GetItemsListaCalibre = (filtro: Filtro, orden: Orden) => Promise<ItemListaCalibre[]>;
