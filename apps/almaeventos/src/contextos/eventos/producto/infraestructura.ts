import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { NuevoProducto, Producto } from "./diseño.ts";

const baseUrlProducto = `/eventos/producto`;

export const productoToAPI = (e: Producto) => ({
    ...e,
    valordefecto: e.valor_defecto,
});

export const getProducto = async (id: string): Promise<Producto> =>
    await RestAPI.get<{ datos: Producto }>(`${baseUrlProducto}/${id}`).then((respuesta) => respuesta.datos);

export const getProductos = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): RespuestaLista<Producto> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    return await RestAPI.get<{ datos: Producto[]; total: number }>(baseUrlProducto + q);
};

export const postProducto = async (_producto: NuevoProducto): Promise<string> => {
    return await RestAPI.post(baseUrlProducto, _producto).then((respuesta) => respuesta.id);
};

export const patchProducto = async (id: string, estado: Partial<Producto>): Promise<void> => {
    const payload = productoToAPI(estado as Producto);
    await RestAPI.patch(`${baseUrlProducto}/${id}`, { cambios: payload });
};

export const deleteProducto = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlProducto}/${id}`);
