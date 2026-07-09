import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import {
    CambiosLineaOrdenAlmacen,
    CambiosOrdenAlmacen,
    DeleteLineasOrden,
    DeleteOrden,
    GetOrden,
    GetOrdenes,
    ItemOrdenAlmacen,
    LecturaLineaOrden,
    LineaOrdenAlmacen,
    NuevaLecturaOrden,
    NuevaLineaOrdenAlmacen,
    NuevaOrdenAlmacen,
    OrdenAlmacen,
    PatchLineaOrden,
    PatchOrden,
    PostLineasOrden,
    PostOrden,
} from "./diseño.ts";

// Tipos API (snake_case)

interface OrdenAlmacenApi {
    id: string;
    fecha: string;
    tipo: "ENTRADA" | "SALIDA" | "TRASPASO";
    almacen_id: string;
    almacen: string;
    abierta: boolean;
    ubicacion_origen_id: string | null;
    ubicacion_origen: string | null;
    caja_origen_id: string | null;
    ubicacion_destino_id: string | null;
    ubicacion_destino: string | null;
    caja_destino_id: string | null;
    lineas: LineaOrdenAlmacenApi[];
}

interface LecturaLineaOrdenApi {
    id: string;
    sku: string;
    lote_id: string | null;
    cantidad: number;
    ubicacion_origen_id: string | null;
    caja_origen_id: string | null;
    ubicacion_destino_id: string | null;
    caja_destino_id: string | null;
    fecha_hora: string;
}

export interface LineaOrdenAlmacenApi {
    id: string;
    sku: string;
    articulo: string;
    lote_id: string | null;
    cantidad_prevista: number;
    cantidad_real?: number;
    ubicacion_origen_id: string | null;
    caja_origen_id: string | null;
    ubicacion_destino_id: string | null;
    caja_destino_id: string | null;
    lecturas: LecturaLineaOrdenApi[];
}

interface NuevaLineaOrdenAlmacenApi {
    sku: string;
    lote_id: string | null;
    cantidad_prevista: number;
    ubicacion_origen_id: string | null;
    caja_origen_id: string | null;
    ubicacion_destino_id: string | null;
    caja_destino_id: string | null;
}

export interface ItemOrdenApi {
    id: string;
    fecha: string;
    tipo: string;
    abierta: boolean;
    estado: string;
    ubicacion_origen_id: string | null;
    caja_origen_id: string | null;
    ubicacion_destino_id: string | null;
    caja_destino_id: string | null;
}

const baseUrl = `/almacen/orden`;

// Mappers API → dominio

export const ordenDesdeApi = (api: OrdenAlmacenApi): OrdenAlmacen => ({
    id: api.id,
    fecha: api.fecha,
    tipo: api.tipo,
    almacenId: api.almacen_id,
    almacen: api.almacen,
    abierta: api.abierta,
    ubicacionOrigenId: api.ubicacion_origen_id,
    ubicacionOrigen: api.ubicacion_origen,
    cajaOrigenId: api.caja_origen_id,
    ubicacionDestinoId: api.ubicacion_destino_id,
    ubicacionDestino: api.ubicacion_destino,
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

// Mappers dominio → API

export const lineaOrdenAApi = (linea: LineaOrdenAlmacen): LineaOrdenAlmacenApi => ({
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
    lecturas: linea.lecturas
        ? linea.lecturas.map((lectura) => ({
            id: lectura.id,
            sku: lectura.sku,
            lote_id: lectura.loteId,
            cantidad: lectura.cantidad,
            ubicacion_origen_id: lectura.ubicacionOrigenId,
            caja_origen_id: lectura.cajaOrigenId,
            ubicacion_destino_id: lectura.ubicacionDestinoId,
            caja_destino_id: lectura.cajaDestinoId,
            fecha_hora: lectura.fechaHora.toISOString(),
        }))
        : [],
});

const nuevaLineaOrdenAApi = (linea: NuevaLineaOrdenAlmacen): NuevaLineaOrdenAlmacenApi => ({
    sku: linea.sku,
    lote_id: linea.loteId,
    cantidad_prevista: linea.cantidadPrevista,
    ubicacion_origen_id: linea.ubicacionOrigenId,
    caja_origen_id: linea.cajaOrigenId,
    ubicacion_destino_id: linea.ubicacionDestinoId,
    caja_destino_id: linea.cajaDestinoId,
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

const nuevaOrdenAApi = (orden: NuevaOrdenAlmacen) => ({
    fecha: (orden.fecha as Date).toISOString().slice(0, 10),
    tipo_orden: orden.tipoOrden,
    almacen_id: orden.almacenId,
    abierta: orden.abierta,
});

const cambiosOrdenAApi = (cambios: CambiosOrdenAlmacen) => {
    const payload: Record<string, unknown> = {};
    if (cambios.cajaOrigenId !== undefined) payload.caja_origen_id = cambios.cajaOrigenId;
    if (cambios.ubicacionOrigenId !== undefined) payload.ubicacion_origen_id = cambios.ubicacionOrigenId;
    if (cambios.cajaDestinoId !== undefined) payload.caja_destino_id = cambios.cajaDestinoId;
    if (cambios.ubicacionDestinoId !== undefined) payload.ubicacion_destino_id = cambios.ubicacionDestinoId;
    return payload;
};

const cambiosLineaOrdenAApi = (cambios: CambiosLineaOrdenAlmacen) => {
    const payload: Record<string, unknown> = {};
    if (cambios.sku !== undefined) payload.sku = cambios.sku;
    if (cambios.loteId !== undefined) payload.lote_id = cambios.loteId;
    if (cambios.cantidadPrevista !== undefined) payload.cantidad_prevista = cambios.cantidadPrevista;
    if (cambios.ubicacionOrigenId !== undefined) payload.ubicacion_origen_id = cambios.ubicacionOrigenId;
    if (cambios.cajaOrigenId !== undefined) payload.caja_origen_id = cambios.cajaOrigenId;
    if (cambios.ubicacionDestinoId !== undefined) payload.ubicacion_destino_id = cambios.ubicacionDestinoId;
    if (cambios.cajaDestinoId !== undefined) payload.caja_destino_id = cambios.cajaDestinoId;
    return payload;
};

// Funciones CRUD

export const getOrdenes: GetOrdenes = (filtro, orden, paginacion) => {
    const q = criteriaQuery(filtro, orden, paginacion);
    return RestAPI.get<{ datos: ItemOrdenApi[]; total: number }>(baseUrl + q).then((respuesta) => ({
        datos: respuesta.datos.map(itemOrdenDesdeApi),
        total: respuesta.total,
    }));
};

export const getOrden: GetOrden = async (id) => {
    const respuesta = await RestAPI.get<{ datos: OrdenAlmacenApi }>(`${baseUrl}/${id}`);
    return ordenDesdeApi(respuesta.datos);
};

export const postOrden: PostOrden = async (nuevaOrden) => {
    const respuesta = await RestAPI.post(baseUrl, nuevaOrdenAApi(nuevaOrden), "Error al crear la orden");
    return respuesta.id as string;
};

export const patchOrden: PatchOrden = async (id, cambios) => {
    await RestAPI.patch(`${baseUrl}/${id}`, cambiosOrdenAApi(cambios), "Error al actualizar la orden");
};

export const deleteOrden: DeleteOrden = async (id) => {
    await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar la orden");
};

export const postLineasOrden: PostLineasOrden = async (id, lineas) => {
    const payload = lineas.map(nuevaLineaOrdenAApi);
    await RestAPI.post(`${baseUrl}/${id}/linea`, payload, "Error al crear líneas de la orden");
};

export const patchLineaOrden: PatchLineaOrden = async (id, lineaId, cambios) => {
    await RestAPI.patch(
        `${baseUrl}/${id}/linea/${lineaId}`,
        cambiosLineaOrdenAApi(cambios),
        "Error al actualizar la línea"
    );
};

export const deleteLineasOrden: DeleteLineasOrden = async (id, lineaIds) => {
    await RestAPI.patch(
        `${baseUrl}/${id}/linea/borrar`,
        { linea_ids: lineaIds },
        "Error al borrar líneas de la orden"
    );
};

interface SkuLoteApi {
    id: string;
    descripcion: string;
    lote_id: string | null;
}

export const getSkuLote = async (codigo: string) => {
    const respuesta = await RestAPI.get<{ datos: SkuLoteApi }>(
        `/almacen/articulo/sku_lote/${codigo}`
    );
    return {
        sku: respuesta.datos.id,
        descripcion: respuesta.datos.descripcion,
        loteId: respuesta.datos.lote_id,
    };
};

export const registrarLecturaOrden = async (
    id: string,
    lectura: NuevaLecturaOrden
): Promise<void> => {
    await RestAPI.post(
        `${baseUrl}/${id}/lectura`,
        {
            sku: lectura.sku,
            lote_id: lectura.idLote,
            cantidad: lectura.cantidad,
            ubicacion_destino_id: lectura.idUbicacionDestino,
            ubicacion_origen_id: lectura.idUbicacionOrigen,
        },
        "Error al registrar lectura de la orden"
    );
};
