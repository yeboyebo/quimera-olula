import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { ArticuloAlmacen } from "./diseño.ts";

const baseUrlArticulos = `/almacen/articulo`;

type ArticuloAlmacenApi = ArticuloAlmacen;

const articuloAlmacenDesdeApi = (t: ArticuloAlmacenApi): ArticuloAlmacen => t;

export const obtenerArticulosAlmacen = async (filtro: Filtro, orden: Orden): Promise<ArticuloAlmacen[]> => {
    const q = criteriaQuery(filtro, orden);

    return RestAPI.get<{ datos: ArticuloAlmacenApi[] }>(baseUrlArticulos + q).then((respuesta) => respuesta.datos.map(articuloAlmacenDesdeApi));
}
