import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import ApiUrls from "../comun/urls.ts";
import { GetItemsListaCategoria, ItemListaCategoria } from "./diseño.ts";

const baseUrl = new ApiUrls().CATEGORIA;

type ItemListaCategoriaApi = {
    id: string;
    descripcion: string;
};


const itemListaCategoriaDesdeApi = (item: ItemListaCategoriaApi): ItemListaCategoria => ({
    id: item.id,
    descripcion: item.descripcion
})

export const getItemsListaCategoria: GetItemsListaCategoria = async (filtro, orden) => {

    return RestAPI.get<{ datos: ItemListaCategoriaApi[] }>(
        `${baseUrl}/items_lista` + criteriaQuery(filtro, orden)
    ).then((respuesta) => respuesta.datos.map(itemListaCategoriaDesdeApi));
}
