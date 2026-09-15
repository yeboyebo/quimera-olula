import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { Articulo, TagArticulo } from "./diseño.ts";

const baseUrl = `/ventas/articulo`;

type ArticuloApi = Articulo;
// type TagArticuloApi = TagArticulo;

interface TagArticuloApi {
    id: string;
    descripcion: string;
    precio: number;
    grupo_iva_producto_id: string;
    por_lotes: boolean;
}

const articuloDesdeApi = (a: ArticuloApi): Articulo => a;
const tagArticuloDesdeApi = (t: TagArticuloApi): TagArticulo => ({
    ...t,
    porLotes: t.por_lotes
});

export const getArticulos = async (filtro: Filtro, orden: Orden): Promise<Articulo[]> => {
    const q = criteriaQuery(filtro, orden);
    return RestAPI.get<{ datos: ArticuloApi[] }>(`${baseUrl}${q}`).then(
        (respuesta) => respuesta.datos.map(articuloDesdeApi)
    );
};

export const getArticulo = async (id: string): Promise<Articulo> =>
    RestAPI.get<{ datos: ArticuloApi }>(`${baseUrl}/${id}`).then(
        (respuesta) => articuloDesdeApi(respuesta.datos)
    );

export const getTagsArticulo = async (filtro: Filtro, orden: Orden): Promise<TagArticulo[]> => {
    const q = criteriaQuery(filtro, orden);
    return RestAPI.get<{ datos: TagArticuloApi[] }>(`${baseUrl}/tags${q}`).then(
        (respuesta) => respuesta.datos.map(tagArticuloDesdeApi)
    );
};
