import { RestAPI } from "../../comun/api/rest_api.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { ActualizarLineaTransferenciaStock, ActualizarTransferenciaStock, CrearLineaTransferenciaStock, CrearTransferenciaStock, EliminarLineaTransferenciaStock, EliminarTransferenciaStock, LineaTransferenciaStock, LineaTransferenciaStock_API, NuevaLineaTransferenciaStock, NuevaLineaTransferenciaStock_API, NuevaTransferenciaStock, NuevaTransferenciaStock_API, ObtenerLineasTransferenciaStock, ObtenerLineaTransferenciaStock, ObtenerTransferenciasStock, ObtenerTransferenciaStock, TransferenciaStock, TransferenciaStock_API } from "./diseño.ts";

const baseUrlTransferencias = `/almacen/transferencia`;

export const transferenciaStockFromAPI = (transferenciaAPI: TransferenciaStock_API): TransferenciaStock => ({
    id: transferenciaAPI.id,
    origen: transferenciaAPI.almacen_origen_id,
    destino: transferenciaAPI.almacen_destino_id,
    fecha: transferenciaAPI.fecha,
    nombre_origen: transferenciaAPI.nombre_almacen_origen,
    nombre_destino: transferenciaAPI.nombre_almacen_destino,
});

export const transferenciaStockToAPI = (transferencia: TransferenciaStock): TransferenciaStock_API => ({
    id: transferencia.id,
    almacen_origen_id: transferencia.origen,
    almacen_destino_id: transferencia.destino,
    fecha: transferencia.fecha,
    nombre_almacen_origen: transferencia.nombre_origen,
    nombre_almacen_destino: transferencia.nombre_destino,
});

export const nuevaTransferenciaStockToAPI = (transferencia: NuevaTransferenciaStock): NuevaTransferenciaStock_API => ({
    almacen_origen_id: transferencia.origen,
    almacen_destino_id: transferencia.destino,
    fecha: transferencia.fecha,
});

export const obtenerTransferenciaStock: ObtenerTransferenciaStock = async (id) =>
    await RestAPI.get<{ datos: TransferenciaStock_API }>(`${baseUrlTransferencias}/${id}`).then((respuesta) =>
        transferenciaStockFromAPI(respuesta.datos)
    );

export const obtenerTransferenciasStock: ObtenerTransferenciasStock = async (
    filtro, orden, paginacion?
) => {
    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<{ datos: TransferenciaStock_API[]; total: number }>(baseUrlTransferencias + q);

    return { datos: respuesta.datos.map(transferenciaStockFromAPI), total: respuesta.total };
};

export const crearTransferenciaStock: CrearTransferenciaStock = async (transferencia) => {
    return await RestAPI.post(baseUrlTransferencias, nuevaTransferenciaStockToAPI(transferencia), "Error al guardar la transferencia").then(
        (respuesta) => respuesta.id
    );
};

export const actualizarTransferenciaStock: ActualizarTransferenciaStock = async (id, transferencia) => {
    const transferenciaAPI = transferenciaStockToAPI(transferencia as TransferenciaStock);
    const transferencia_limpia = Object.fromEntries(
        Object.entries(transferenciaAPI).map(([k, v]) => [k, v ?? ""])
    );
    await RestAPI.patch(`${baseUrlTransferencias}/${id}`, transferencia_limpia, "Error al guardar actualizar la transferencia " + id);
};

export const eliminarTransferenciaStock: EliminarTransferenciaStock = async (id) => {
    await RestAPI.delete(`${baseUrlTransferencias}/${id}`, "Error al borrar la transferencia " + id);
}

// LINEAS

export const lineaTransferenciaFromAPI = (lineaAPI: LineaTransferenciaStock_API): LineaTransferenciaStock => ({
    id: lineaAPI.id,
    transferencia_id: lineaAPI.transferencia_id,
    sku: lineaAPI.sku,
    descripcion_producto: lineaAPI.descripcion,
    cantidad: lineaAPI.cantidad,
});

export const lineaTransferenciaToAPI = (linea: LineaTransferenciaStock): LineaTransferenciaStock_API => ({
    id: linea.id,
    transferencia_id: linea.transferencia_id,
    sku: linea.sku,
    descripcion: linea.descripcion_producto,
    cantidad: linea.cantidad,
});

export const nuevaLineaTransferenciaStockToAPI = (linea: NuevaLineaTransferenciaStock): NuevaLineaTransferenciaStock_API => ({
    sku: linea.sku,
    cantidad: linea.cantidad,
});

export const obtenerLineaTransferenciaStock: ObtenerLineaTransferenciaStock = async (id, idLinea) =>
    await RestAPI.get<{ datos: LineaTransferenciaStock_API }>(`${baseUrlTransferencias}/${id}/linea/${idLinea}`).then((respuesta) =>
        lineaTransferenciaFromAPI(respuesta.datos)
    );

export const obtenerLineasTransferenciaStock: ObtenerLineasTransferenciaStock = async (
    id, filtro, orden, paginacion?
) => {
    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<{ datos: LineaTransferenciaStock_API[]; total: number }>(`${baseUrlTransferencias}/${id}/linea` + q);

    return { datos: respuesta.datos.map(lineaTransferenciaFromAPI), total: respuesta.total };
};

export const crearLineaTransferenciaStock: CrearLineaTransferenciaStock = async (id, linea) => {
    return await RestAPI.post(`${baseUrlTransferencias}/${id}/linea`, nuevaLineaTransferenciaStockToAPI(linea), "Error al guardar la línea de transferencia").then(
        (respuesta) => respuesta.id
    );
};

export const actualizarLineaTransferenciaStock: ActualizarLineaTransferenciaStock = async (id, idLinea, linea) => {
    const lineaAPI = lineaTransferenciaToAPI(linea as LineaTransferenciaStock);
    const linea_limpia = Object.fromEntries(
        Object.entries(lineaAPI).map(([k, v]) => [k, v ?? ""])
    );
    await RestAPI.patch(`${baseUrlTransferencias}/${id}/linea/${idLinea}`, linea_limpia, "Error al guardar actualizar la línea de transferencia " + id + "/" + idLinea);
};

export const eliminarLineaTransferenciaStock: EliminarLineaTransferenciaStock = async (id, idLinea) => {
    await RestAPI.delete(`${baseUrlTransferencias}/${id}/linea/${idLinea}`, "Error al borrar la línea de transferencia " + id + "/" + idLinea);
};
