import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { GetPedidos, ItemPedidoCompra } from "./diseño.ts";


interface ItemPedidoCompraApi {
    id: string;
    fecha: string;
    codigo: string;
    proveedor: string;
}

const baseUrl = `/almacen/pedido_compra`;

export const itemPedidoCompraDesdeApi = (api: ItemPedidoCompraApi): ItemPedidoCompra => ({
    id: api.id,
    fecha: new Date(Date.parse(api.fecha)),
    codigo: api.codigo,
    proveedor: api.proveedor,
});

export const getPedidos: GetPedidos = (filtro, orden, paginacion) => {
    const q = criteriaQuery(filtro, orden, paginacion);
    return RestAPI.get<{ datos: ItemPedidoCompraApi[]; total: number }>(baseUrl + q).then((respuesta) => ({
        datos: respuesta.datos.map(itemPedidoCompraDesdeApi),
        total: respuesta.total,
    }));
};
