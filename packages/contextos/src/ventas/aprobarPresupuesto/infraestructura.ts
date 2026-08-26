import { RestAPI } from "@olula/lib/api/rest_api.js";
import ApiUrls from "../comun/urls.ts";
import { PatchAprobarPresupuestoParcial, PatchCerrarLineaPresupuesto } from "./diseño.ts";
import { transformarLineasPedido } from "./dominio.ts";

const baseUrl = new ApiUrls().PRESUPUESTO;

export const patchAprobarPresupuestoParcial: PatchAprobarPresupuestoParcial = async (id, lineas) => {
    const cambios = { lineas: transformarLineasPedido(lineas) };
    const respuesta = (await RestAPI.patch(
        `${baseUrl}/${id}/aprobar`,
        cambios,
        "Error al aprobar el presupuesto"
    )) as unknown as { pedido_id: string; codigo?: string };

    const pedidoId = String(respuesta.pedido_id ?? "");
    return { id: pedidoId, codigo: String(respuesta.codigo ?? pedidoId) };
}

export const patchCerrarLineaPresupuesto: PatchCerrarLineaPresupuesto = async (presupuestoId, lineaId, cerrada) => {
    await RestAPI.patch(`${baseUrl}/${presupuestoId}/linea/${lineaId}/cerrar`, { cerrada }, "Error al cambiar estado de línea");
}
