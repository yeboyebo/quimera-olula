import { empresaActual } from "#/valores/empresaActual.ts";
import { RestAPI } from "@olula/lib/api/rest_api.ts";
import ApiUrls from "../comun/urls.ts";
import {
    Albaran,
    AlbaranarPedidos,
    BorrarLineasAlbaran,
    CambiosAlbaran,
    CambiosLineaAlbaran,
    DeleteAlbaran,
    GetAlbaran,
    GetAlbaranes,
    GetLineaAlbaran,
    GetLineasAlbaran,
    LineaAlbaran,
    NuevaLineaAlbaran,
    NuevaLineaLibreAlbaran,
    NuevoAlbaran,
    NuevoAlbaranProveedorNoRegistrado,
    PatchAlbaran,
    PatchLineaAlbaran,
    PostAlbaran,
    PostLineasAlbaran,
} from "./diseño.ts";

const baseUrl = new ApiUrls().ALBARAN;

export interface AlbaranApi {
    id: string;
    codigo: string;
    ejercicio_id: string;
    serie_id: string;
    numero: string;
    fecha: string;
    hora: string;
    numero_proveedor: string | null;
    proveedor_id: string | null;
    nombre_proveedor: string;
    id_fiscal: string;
    almacen_id: string | null;
    nombre_almacen: string | null;
    forma_pago_id: string | null;
    nombre_forma_pago: string | null;
    grupo_iva_negocio_id: string;
    divisa_id: string;
    tasa_conversion: number;
    neto: number;
    total_iva: number;
    total_recargo: number;
    total_irpf: number;
    total: number;
    total_divisa_empresa: number;
    recargo_financiero: number;
    factura_id: string | null;
    pendiente_factura: boolean;
    observaciones: string | null;
}

export interface LineaAlbaranApi {
    id: string;
    albaran_id: string;
    pedido_id: string | null;
    linea_pedido_id: string | null;
    referencia: string | null;
    descripcion: string;
    cantidad: number;
    pvp_unitario: number;
    dto_porcentual: number;
    dto_lineal: number;
    pvp_sin_dto: number;
    pvp_total: number;
    grupo_iva_producto_id: string;
    tipo_iva: number;
    tipo_recargo: number;
    tipo_irpf: number;
}

/** Las dos formas son excluyentes: con proveedor_id se hereda del maestro. */
type ProveedorAlbaranApi =
    | { proveedor_id: string }
    | { nombre: string; id_fiscal: string };

type ArticuloLineaAlbaranApi =
    | { articulo_id: string; descripcion?: string }
    | { descripcion: string };

interface NuevaLineaAlbaranApi {
    articulo: ArticuloLineaAlbaranApi;
    cantidad: number;
    pvp_unitario: number;
}

interface NuevoAlbaranApi {
    proveedor: ProveedorAlbaranApi;
    fecha: string;
    empresa_id: string;
    numero_proveedor?: string | null;
    almacen_id?: string | null;
    observaciones?: string | null;
}

interface CambiosAlbaranApi {
    fecha?: string;
    hora?: string;
    numero_proveedor?: string | null;
    divisa?: { id: string; tasa_conversion?: number };
    grupo_iva_negocio_id?: string;
    forma_pago_id?: string;
    almacen_id?: string | null;
    observaciones?: string | null;
}

interface CambiosLineaAlbaranApi {
    articulo?: ArticuloLineaAlbaranApi;
    cantidad?: number;
    pvp_unitario?: number;
    dto_porcentual?: number;
    dto_lineal?: number;
    grupo_iva_producto_id?: string;
    tipo_irpf?: number;
}

const fechaAApi = (fecha: Date): string => fecha.toISOString().slice(0, 10);

export const albaranDesdeApi = (api: AlbaranApi): Albaran => ({
    id: api.id,
    codigo: api.codigo,
    ejercicioId: api.ejercicio_id,
    serieId: api.serie_id,
    numero: api.numero,
    fecha: new Date(Date.parse(api.fecha)),
    hora: api.hora,
    numeroProveedor: api.numero_proveedor,
    proveedorId: api.proveedor_id,
    nombreProveedor: api.nombre_proveedor,
    idFiscal: api.id_fiscal,
    almacenId: api.almacen_id,
    nombreAlmacen: api.nombre_almacen,
    formaPagoId: api.forma_pago_id,
    nombreFormaPago: api.nombre_forma_pago,
    grupoIvaNegocioId: api.grupo_iva_negocio_id,
    divisaId: api.divisa_id,
    tasaConversion: api.tasa_conversion,
    neto: api.neto,
    totalIva: api.total_iva,
    totalRecargo: api.total_recargo,
    totalIrpf: api.total_irpf,
    total: api.total,
    totalDivisaEmpresa: api.total_divisa_empresa,
    recargoFinanciero: api.recargo_financiero,
    facturaId: api.factura_id,
    pendienteFactura: api.pendiente_factura,
    observaciones: api.observaciones,
});

export const lineaAlbaranDesdeApi = (api: LineaAlbaranApi): LineaAlbaran => ({
    id: api.id,
    albaranId: api.albaran_id,
    pedidoId: api.pedido_id,
    lineaPedidoId: api.linea_pedido_id,
    referencia: api.referencia,
    descripcion: api.descripcion,
    cantidad: api.cantidad,
    pvpUnitario: api.pvp_unitario,
    dtoPorcentual: api.dto_porcentual,
    dtoLineal: api.dto_lineal,
    pvpSinDto: api.pvp_sin_dto,
    pvpTotal: api.pvp_total,
    grupoIvaProductoId: api.grupo_iva_producto_id,
    tipoIva: api.tipo_iva,
    tipoRecargo: api.tipo_recargo,
    tipoIrpf: api.tipo_irpf,
});

const esProveedorNoRegistrado = (
    albaran: NuevoAlbaran | NuevoAlbaranProveedorNoRegistrado
): albaran is NuevoAlbaranProveedorNoRegistrado =>
    (albaran as NuevoAlbaranProveedorNoRegistrado).nombre !== undefined;

const proveedorAApi = (
    albaran: NuevoAlbaran | NuevoAlbaranProveedorNoRegistrado
): ProveedorAlbaranApi =>
    esProveedorNoRegistrado(albaran)
        ? { nombre: albaran.nombre, id_fiscal: albaran.idFiscal }
        : { proveedor_id: albaran.proveedorId };

const nuevoAlbaranAApi = (
    albaran: NuevoAlbaran | NuevoAlbaranProveedorNoRegistrado
): NuevoAlbaranApi => ({
    proveedor: proveedorAApi(albaran),
    fecha: fechaAApi(albaran.fecha),
    empresa_id: empresaActual(),
    ...(albaran.numeroProveedor ? { numero_proveedor: albaran.numeroProveedor } : {}),
    ...(albaran.almacenId ? { almacen_id: albaran.almacenId } : {}),
    ...(albaran.observaciones ? { observaciones: albaran.observaciones } : {}),
});

/**
 * La serie y el número no se pueden cambiar. almacen_id y divisa a null los
 * ignora el servidor, así que solo se mandan con valor.
 */
const cambiosAlbaranAApi = (a: CambiosAlbaran): CambiosAlbaranApi => {
    const cambios: CambiosAlbaranApi = {};
    if (a.fecha !== undefined) cambios.fecha = fechaAApi(a.fecha);
    if (a.hora !== undefined) cambios.hora = a.hora;
    if (a.numeroProveedor !== undefined) cambios.numero_proveedor = a.numeroProveedor;
    if (a.divisaId) {
        cambios.divisa = {
            id: a.divisaId,
            ...(a.tasaConversion !== undefined ? { tasa_conversion: a.tasaConversion } : {}),
        };
    }
    if (a.grupoIvaNegocioId !== undefined) cambios.grupo_iva_negocio_id = a.grupoIvaNegocioId;
    if (a.formaPagoId) cambios.forma_pago_id = a.formaPagoId;
    if (a.almacenId) cambios.almacen_id = a.almacenId;
    if (a.observaciones !== undefined) cambios.observaciones = a.observaciones;
    return cambios;
};

const esLineaLibre = (
    linea: NuevaLineaAlbaran | NuevaLineaLibreAlbaran
): linea is NuevaLineaLibreAlbaran => !(linea as NuevaLineaAlbaran).referencia;

const articuloAApi = (
    linea: NuevaLineaAlbaran | NuevaLineaLibreAlbaran
): ArticuloLineaAlbaranApi =>
    esLineaLibre(linea)
        ? { descripcion: linea.descripcion }
        : {
            articulo_id: linea.referencia,
            ...(linea.descripcion ? { descripcion: linea.descripcion } : {}),
        };

/** pvp_unitario es obligatorio siempre: en compras no hay tarifa de la que derivarlo. */
const nuevaLineaAApi = (
    linea: NuevaLineaAlbaran | NuevaLineaLibreAlbaran
): NuevaLineaAlbaranApi => ({
    articulo: articuloAApi(linea),
    cantidad: linea.cantidad,
    pvp_unitario: linea.pvpUnitario,
});

const cambiosLineaAApi = (linea: CambiosLineaAlbaran): CambiosLineaAlbaranApi => {
    const cambios: CambiosLineaAlbaranApi = {};
    if (linea.referencia !== undefined || linea.descripcion !== undefined) {
        cambios.articulo = linea.referencia
            ? {
                articulo_id: linea.referencia,
                ...(linea.descripcion ? { descripcion: linea.descripcion } : {}),
            }
            : { descripcion: linea.descripcion ?? "" };
    }
    if (linea.cantidad !== undefined) cambios.cantidad = linea.cantidad;
    if (linea.pvpUnitario !== undefined) cambios.pvp_unitario = linea.pvpUnitario;
    if (linea.dtoPorcentual !== undefined) cambios.dto_porcentual = linea.dtoPorcentual;
    if (linea.dtoLineal !== undefined) cambios.dto_lineal = linea.dtoLineal;
    if (linea.grupoIvaProductoId !== undefined) {
        cambios.grupo_iva_producto_id = linea.grupoIvaProductoId;
    }
    if (linea.tipoIrpf !== undefined) cambios.tipo_irpf = linea.tipoIrpf;
    return cambios;
};

export const getAlbaran: GetAlbaran = async (id) =>
    await RestAPI.getItem<Albaran, AlbaranApi>(
        `${baseUrl}/${id}`,
        albaranDesdeApi,
        "Error al obtener el albarán"
    );

export const getAlbaranes: GetAlbaranes = async (criteria) =>
    await RestAPI.getQuery<Albaran, AlbaranApi>(
        baseUrl,
        criteria,
        albaranDesdeApi,
        "Error al obtener los albaranes"
    );

export const postAlbaran: PostAlbaran = async (nuevoAlbaran) => {
    const respuesta = await RestAPI.post<NuevoAlbaranApi>(
        baseUrl,
        nuevoAlbaranAApi(nuevoAlbaran),
        "Error al crear el albarán"
    );
    return respuesta.id;
};

/**
 * Genera un solo albarán con lo pendiente de los pedidos indicados. Sin lineas
 * albarana todo lo pendiente. Los pedidos deben compartir proveedor, serie,
 * almacén y forma de pago: si no, el servidor responde 409.
 */
export const albaranarPedidos: AlbaranarPedidos = async (pedidoIds, lineas) => {
    const respuesta = await RestAPI.post(
        `${baseUrl}/desde-pedidos`,
        {
            pedido_ids: pedidoIds,
            ...(lineas
                ? {
                    lineas: lineas.map((l) => ({
                        linea_pedido_id: l.lineaPedidoId,
                        cantidad: l.cantidad,
                    })),
                }
                : {}),
        },
        "Error al albaranar los pedidos"
    );
    return respuesta.id;
};

export const patchAlbaran: PatchAlbaran = async (id, cambios) => {
    await RestAPI.patch(
        `${baseUrl}/${id}`,
        { cambios: cambiosAlbaranAApi(cambios) },
        "Error al guardar el albarán"
    );
};

export const deleteAlbaran: DeleteAlbaran = async (id) => {
    await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar el albarán");
};

export const getLineasAlbaran: GetLineasAlbaran = async (id) =>
    await RestAPI.getLista<LineaAlbaran, LineaAlbaranApi>(
        `${baseUrl}/${id}/linea`,
        lineaAlbaranDesdeApi,
        "Error al obtener las líneas del albarán"
    );

export const getLineaAlbaran: GetLineaAlbaran = async (id, lineaId) =>
    await RestAPI.getItem<LineaAlbaran, LineaAlbaranApi>(
        `${baseUrl}/${id}/linea/${lineaId}`,
        lineaAlbaranDesdeApi,
        "Error al obtener la línea"
    );

export const postLineasAlbaran: PostLineasAlbaran = async (id, lineas) => {
    const respuesta = await RestAPI.post<{ lineas: NuevaLineaAlbaranApi[] }>(
        `${baseUrl}/${id}/linea`,
        { lineas: lineas.map(nuevaLineaAApi) },
        "Error al crear las líneas del albarán"
    );
    // La respuesta de este endpoint es { lineas: string[] }, no { id }.
    const { lineas: ids } = respuesta as unknown as { lineas: string[] };
    return ids;
};

export const postLineaAlbaran = async (
    id: string,
    linea: NuevaLineaAlbaran | NuevaLineaLibreAlbaran
): Promise<string> => {
    const [lineaId] = await postLineasAlbaran(id, [linea]);
    return lineaId;
};

export const patchLineaAlbaran: PatchLineaAlbaran = async (id, lineaId, cambios) => {
    await RestAPI.patch(
        `${baseUrl}/${id}/linea/${lineaId}`,
        { cambios: cambiosLineaAApi(cambios) },
        "Error al actualizar la línea"
    );
};

export const borrarLineasAlbaran: BorrarLineasAlbaran = async (id, lineas) => {
    await RestAPI.patch(
        `${baseUrl}/${id}/linea/borrar`,
        { lineas },
        "Error al borrar las líneas del albarán"
    );
};
