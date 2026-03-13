import { Filtro, Orden } from "@olula/lib/diseño.js";


export type ItemListaMarca = {
    id: string;
    descripcion: string;
    idCategoria: string;
};


export type GetItemsListaMarca = (filtro: Filtro, orden: Orden) => Promise<ItemListaMarca[]>;
export type GetItemsListaSeleccionMarca = (idVariedad: string) => Promise<ItemListaMarca[]>;
