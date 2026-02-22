import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import ApiUrls from "../comun/urls.ts";
import { GetItemsListaMarca, ItemListaMarca } from "./diseño.ts";

const baseUrl = new ApiUrls().MARCA;

type ItemListaMarcaApi = {
    id: string;
    descripcion: string;
};


const itemListaMarcaDesdeApi = (item: ItemListaMarcaApi): ItemListaMarca => ({
    id: item.id,
    descripcion: item.descripcion
})

export const getItemsListaMarca: GetItemsListaMarca = async (filtro, orden) => {

    return RestAPI.get<{ datos: ItemListaMarcaApi[] }>(
        `${baseUrl}/items_lista` + criteriaQuery(filtro, orden)
    ).then((respuesta) => respuesta.datos.map(itemListaMarcaDesdeApi));
}
