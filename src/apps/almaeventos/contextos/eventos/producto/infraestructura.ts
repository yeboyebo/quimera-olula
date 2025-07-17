import { RestAPI } from "../../../../../contextos/comun/api/rest_api.ts";
import { Filtro, Orden } from "../../../../../contextos/comun/diseño.ts";
import { criteriaQuery } from "../../../../../contextos/comun/infraestructura.ts";
import { NuevoProducto, Producto } from "./diseño.ts";

const baseUrlProducto = `/eventos/producto`;

export const productoToAPI = (e: Producto) => ({
    ...e,
    valordefecto: e.valor_defecto,
});

export const getProducto = async (id: string): Promise<Producto> =>
    await RestAPI.get<{ datos: Producto }>(`${baseUrlProducto}/${id}`).then((respuesta) => respuesta.datos);

export const getProductos = async (_filtro: Filtro, _orden: Orden): Promise<Producto[]> => {
    const q = criteriaQuery(_filtro, _orden);
    return RestAPI.get<{ datos: Producto[] }>(baseUrlProducto + q).then((respuesta) => respuesta.datos);
};

export const postProducto = async (_producto: NuevoProducto): Promise<string> => {
    _producto.codFamilia = _producto.codFamilia || "EVEN";
    return await RestAPI.post(baseUrlProducto, _producto).then((respuesta) => respuesta.id);
};

export const patchProducto = async (id: string, estado: Partial<Producto>): Promise<void> => {
    const payload = productoToAPI(estado as Producto);
    await RestAPI.patch(`${baseUrlProducto}/${id}`, { cambios: payload });
};

export const deleteProducto = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlProducto}/${id}`);
