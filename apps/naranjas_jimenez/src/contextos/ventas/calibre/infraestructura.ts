import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import ApiUrls from "../comun/urls.ts";
import { GetItemsListaCalibre, GetItemsListaSeleccionCalibre, ItemListaCalibre } from "./diseño.ts";

const baseUrl = new ApiUrls().CALIBRE;

type ItemListaCalibreApi = {
    id: string;
    descripcion: string;
};


const itemListaCalibreDesdeApi = (item: ItemListaCalibreApi): ItemListaCalibre => ({
    id: item.id,
    descripcion: item.descripcion
})

export const getItemsListaCalibre: GetItemsListaCalibre = async (filtro, orden) => {

    return RestAPI.get<{ datos: ItemListaCalibreApi[] }>(
        `${baseUrl}/items_lista` + criteriaQuery(filtro, orden)
    ).then((respuesta) => respuesta.datos.map(itemListaCalibreDesdeApi));
}

export const getItemsListaSeleccionCalibre: GetItemsListaSeleccionCalibre = async (idVariedad, idMarca) => {

    return RestAPI.get<{ datos: ItemListaCalibreApi[] }>(
        `${baseUrl}/items_lista_seleccion/${idVariedad}/${idMarca}`
    ).then((respuesta) => respuesta.datos.map(itemListaCalibreDesdeApi));
}
