import ApiUrls from "#/ventas/comun/urls.ts";
import { LineaPedidoAPI, postLinea } from "#/ventas/pedido/infraestructura.ts";
import { RestAPI } from "@olula/lib/api/rest_api.js";
import { LineaPedidoNrj, PostLineaNrj } from "./diseño.ts";

export interface LineaPedidoApiNrj extends LineaPedidoAPI {
    variedad_id: string
}
const baseUrl = new ApiUrls().PEDIDO;

const lineaPedidoDesdeApi = (l: LineaPedidoApiNrj): LineaPedidoNrj => {
    return {
        ...l,
        idVariedad: l.variedad_id
    }
};

export const postLineaNrj: PostLineaNrj = async (id, linea) => {

    return await RestAPI.post(
        `${baseUrl}/${id}/linea`,
        {
            lineas: [{
                variedad_id: linea.idVariedad,
                cantidad: linea.cantidad
            }]
        },
        "Error al crear linea de pedido"
    ).then((respuesta) => {
        const miRespuesta = respuesta as unknown as { ids: string[] };
        return miRespuesta.ids[0];
    });
}

export const ventasPedidoInfra = {
    linea_desde_api: lineaPedidoDesdeApi,
    postLinea: postLinea
}