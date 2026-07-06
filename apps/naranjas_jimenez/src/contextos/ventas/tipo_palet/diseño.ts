import { Filtro, Orden, Paginacion } from "@olula/lib/diseño.js";

export type ItemListaTipoPalet = {
    id: string;
    descripcion: string;
    idTipoEnvase: string;
    cantidadEnvase: number;
};


export type GetItemsListaTipoPalet = (filtro: Filtro, orden: Orden, paginacion?: Paginacion) => Promise<ItemListaTipoPalet[]>;