import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import ApiUrls from "../comun/urls.ts";
import { GetItemsListaMarca, GetItemsListaSeleccionMarca, ItemListaMarca } from "./diseño.ts";

const baseUrl = new ApiUrls().MARCA;

type ItemListaMarcaApi = {
    id: string;
    descripcion: string;
    categoria_id: string;
};


const itemListaMarcaDesdeApi = (item: ItemListaMarcaApi): ItemListaMarca => ({
    id: item.id,
    descripcion: item.descripcion,
    idCategoria: item.categoria_id,
})

export const getItemsListaMarca: GetItemsListaMarca = async (filtro, orden) => {

    return RestAPI.get<{ datos: ItemListaMarcaApi[] }>(
        `${baseUrl}/items_lista` + criteriaQuery(filtro, orden)
    ).then((respuesta) => respuesta.datos.map(itemListaMarcaDesdeApi));
}


export const getItemsListaSeleccionMarca: GetItemsListaSeleccionMarca = async (idVariedad) => {

    return RestAPI.get<{ datos: ItemListaMarcaApi[] }>(
        `${baseUrl}/items_lista_seleccion/${idVariedad}`
    ).then((respuesta) => respuesta.datos.map(itemListaMarcaDesdeApi));
}
