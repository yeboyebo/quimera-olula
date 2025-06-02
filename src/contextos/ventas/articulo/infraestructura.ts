import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { TagArticulo } from "./diseño.ts";

const baseUrlVentas = `/ventas/articulo`;

type TagArticuloApi = TagArticulo;

const tagArticuloDesdeApi = (t: TagArticuloApi): TagArticulo => t;

export const getTagsArticulo = async (filtro: Filtro, orden: Orden): Promise<TagArticulo[]> => {
    const q = criteriaQuery(filtro, orden);

    return RestAPI.get<{ datos: TagArticuloApi[] }>(`${baseUrlVentas}/tags${q}`).then((respuesta) => respuesta.datos.map(tagArticuloDesdeApi));
}