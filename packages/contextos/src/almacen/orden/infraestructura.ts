import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import {
    ItemOrdenAlmacen,
    ItemOrdenApi,
    LecturaLineaOrden,
    LecturaLineaOrdenApi,
    LineaOrdenAlmacen,
    LineaOrdenAlmacenApi,
    NuevaLecturaOrden,
    NuevaLineaOrdenAlmacen,
    OrdenAlmacen,
    OrdenAlmacenApi,
} from "./diseño.ts";
import { NuevaOrdenAlmacen } from "./vistas/crear/diseño.ts";


const baseUrl = `/almacen/orden`;

// Mappers

export const ordenDesdeApi = (api: OrdenAlmacenApi): OrdenAlmacen => ({
    id: api.id,
    fecha: api.fecha,
    tipoOrden: api.tipo,
    almacenId: api.almacen_id,
    almacen: api.almacen,
    abierta: api.abierta,
    ubicacionOrigenId: api.ubicacion_origen_id,
    cajaOrigenId: api.caja_origen_id,
    ubicacionDestinoId: api.ubicacion_destino_id,
    cajaDestinoId: api.caja_destino_id,
    lineas: api.lineas.map(lineaOrdenDesdeApi),
});

export const lecturaLineaOrdenDesdeApi = (api: LecturaLineaOrdenApi): LecturaLineaOrden => ({
    id: api.id,
    sku: api.sku,
    loteId: api.lote_id,
    cantidad: api.cantidad,
    ubicacionOrigenId: api.ubicacion_origen_id,
    cajaOrigenId: api.caja_origen_id,
    ubicacionDestinoId: api.ubicacion_destino_id,
    cajaDestinoId: api.caja_destino_id,
    fechaHora: new Date(api.fecha_hora),
});

export const lineaOrdenDesdeApi = (api: LineaOrdenAlmacenApi): LineaOrdenAlmacen => ({
    ...(api.id !== undefined ? { id: api.id } : {}),
    id: api.id,
    sku: api.sku,
    articulo: api.articulo,
    loteId: api.lote_id,
    cantidadPrevista: api.cantidad_prevista,
    ...(api.cantidad_real !== undefined ? { cantidadReal: api.cantidad_real } : {}),
    ubicacionOrigenId: api.ubicacion_origen_id,
    cajaOrigenId: api.caja_origen_id,
    ubicacionDestinoId: api.ubicacion_destino_id,
    cajaDestinoId: api.caja_destino_id,
    lecturas: api.lecturas.map(lecturaLineaOrdenDesdeApi),
});

export const lineaOrdenAApi = (linea: LineaOrdenAlmacen): LineaOrdenAlmacenApi => ({
    ...(linea.id !== undefined ? { id: linea.id } : {}),
    id: linea.id,
    sku: linea.sku,
    articulo: linea.articulo,
    lote_id: linea.loteId,
    cantidad_prevista: linea.cantidadPrevista,
    ...(linea.cantidadReal !== undefined ? { cantidad_real: linea.cantidadReal } : {}),
    ubicacion_origen_id: linea.ubicacionOrigenId,
    caja_origen_id: linea.cajaOrigenId,
    ubicacion_destino_id: linea.ubicacionDestinoId,
    caja_destino_id: linea.cajaDestinoId,
    lecturas: linea.lecturas.map((lectura) => ({
        id: lectura.id,
        sku: lectura.sku,
        lote_id: lectura.loteId,
        cantidad: lectura.cantidad,
        ubicacion_origen_id: lectura.ubicacionOrigenId,
        caja_origen_id: lectura.cajaOrigenId,
        ubicacion_destino_id: lectura.ubicacionDestinoId,
        caja_destino_id: lectura.cajaDestinoId,
        fecha_hora: lectura.fechaHora.toISOString(),
    })),
});

export const itemOrdenDesdeApi = (api: ItemOrdenApi): ItemOrdenAlmacen => ({
    id: api.id,
    fecha: api.fecha,
    tipo: api.tipo,
    abierta: api.abierta,
    estado: api.estado,
    ubicacionOrigenId: api.ubicacion_origen_id,
    cajaOrigenId: api.caja_origen_id,
    ubicacionDestinoId: api.ubicacion_destino_id,
    cajaDestinoId: api.caja_destino_id,
});

// Funciones REST

export const getOrdenes = (filtro: Filtro, orden: Orden, paginacion?: Paginacion): RespuestaLista<ItemOrdenAlmacen> => {
    const q = criteriaQuery(filtro, orden, paginacion);
    return RestAPI.get<{ datos: ItemOrdenApi[]; total: number }>(baseUrl + q).then((respuesta) => ({
        datos: respuesta.datos.map(itemOrdenDesdeApi),
        total: respuesta.total,
    }));
};

export const getOrden = async (id: string): Promise<OrdenAlmacen> => {
    const respuesta = await RestAPI.get<{ datos: OrdenAlmacenApi }>(`${baseUrl}/${id}`);
    return ordenDesdeApi(respuesta.datos);
};

export const crearOrden = async (orden: NuevaOrdenAlmacen): Promise<string> => {
    const payload = {
        fecha: (orden.fecha as Date).toISOString().slice(0, 10),
        tipo_orden: orden.tipoOrden,
        almacen_id: orden.almacenId,
        abierta: orden.abierta,
    };
    const respuesta = await RestAPI.post(baseUrl, payload, "Error al crear la orden");
    return respuesta.id as string;
};

export const cambiarOrden = async (id: string, cambios: Partial<OrdenAlmacen>): Promise<void> => {
    // const payload: Record<string, unknown> = {};
    // if (cambios.fecha !== undefined) payload.fecha = cambios.fecha;
    // if (cambios.tipoOrden !== undefined) payload.tipo_orden = cambios.tipoOrden;
    // if (cambios.abierta !== undefined) payload.abierta = cambios.abierta;
    // if (cambios.cajaOrigenId !== undefined) payload.caja_origen_id = cambios.cajaOrigenId;
    // if (cambios.ubicacionOrigenId !== undefined) payload.ubicacion_origen_id = cambios.ubicacionOrigenId;
    // if (cambios.cajaDestinoId !== undefined) payload.caja_destino_id = cambios.cajaDestinoId;
    const payload = {
        caja_origen_id: cambios.cajaOrigenId,
        ubicacion_origen_id: cambios.ubicacionOrigenId,
        caja_destino_id: cambios.cajaDestinoId,
        ubicacion_destino_id: cambios.ubicacionDestinoId,
    }
    await RestAPI.patch(`${baseUrl}/${id}`, payload, "Error al actualizar la orden " + id);
};

export const borrarOrden = async (id: string): Promise<void> => {
    await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar la orden " + id);
};

export const crearLineasOrden = async (
    id: string,
    lineas: NuevaLineaOrdenAlmacen[]
): Promise<void> => {
    const payload = lineas.map(lineaOrdenAApi);
    await RestAPI.post(`${baseUrl}/${id}/linea`, payload, "Error al crear líneas de la orden");
};

export const cambiarLineaOrden = async (
    id: string,
    lineaId: string,
    cambios: Partial<LineaOrdenAlmacen>
): Promise<void> => {
    const payload: Record<string, unknown> = {};
    if (cambios.sku !== undefined) payload.sku = cambios.sku;
    if (cambios.loteId !== undefined) payload.lote_id = cambios.loteId;
    if (cambios.cantidadPrevista !== undefined) payload.cantidad_prevista = cambios.cantidadPrevista;
    if (cambios.ubicacionOrigenId !== undefined) payload.ubicacion_origen_id = cambios.ubicacionOrigenId;
    if (cambios.cajaOrigenId !== undefined) payload.caja_origen_id = cambios.cajaOrigenId;
    if (cambios.ubicacionDestinoId !== undefined) payload.ubicacion_destino_id = cambios.ubicacionDestinoId;
    if (cambios.cajaDestinoId !== undefined) payload.caja_destino_id = cambios.cajaDestinoId;
    await RestAPI.patch(
        `${baseUrl}/${id}/linea/${lineaId}`,
        payload,
        "Error al actualizar la línea " + lineaId
    );
};

export const borrarLineasOrden = async (id: string, lineaIds: string[]): Promise<void> => {
    await RestAPI.patch(
        `${baseUrl}/${id}/linea/borrar`,
        { linea_ids: lineaIds },
        "Error al borrar líneas de la orden"
    );
};

export const registrarLecturaOrden = async (
    id: string,
    lectura: NuevaLecturaOrden
): Promise<void> => {
    await RestAPI.post(
        `${baseUrl}/${id}/lectura`,
        {
            sku: lectura.sku,
            lote_id: null,
            cantidad: lectura.cantidad,
            ubicacion_destino_id: lectura.idUbicacionDestino,
            ubicacion_origen_id: lectura.idUbicacionOrigen,
        },
        "Error al registrar lectura de la orden"
    );
};
