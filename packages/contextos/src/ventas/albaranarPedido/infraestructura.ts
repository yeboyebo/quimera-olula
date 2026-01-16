import { RestAPI } from "@olula/lib/api/rest_api.js";
import ApiUrls from "../comun/urls.ts";
import { PatchAlbaranarPedido } from "./diseño.ts";
import { transformarLineasAlbaran } from "./dominio.ts";

const baseUrl = new ApiUrls().PEDIDO;

export const patchAlbaranarPedido: PatchAlbaranarPedido = async (id, lineas) => {
    const cambios = { lineas: transformarLineasAlbaran(lineas) };
    await RestAPI.patch(`${baseUrl}/${id}/albaranar`, cambios, "Error al cambiar cliente del pedido");
}