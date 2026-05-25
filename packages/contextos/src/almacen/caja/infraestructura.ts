import { almacenLocal } from "#/almacen/almacen/infraestructura.ts";
import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { ClausulaFiltro, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.js";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { Caja, CajaAPI, MovimientoCaja } from "./diseño.ts";

const baseUrlCaja = `/almacen/caja`;
const baseUrlTransferencia = `/almacen/transferencia`;

export const cajaFromApi = (cajaApi: CajaAPI): Caja => ({
    ...cajaApi,
});

export const cajaToApi = (caja: Caja): CajaAPI => ({
    ...caja,
});

export const getCaja = async (id: string): Promise<Caja> =>
    await RestAPI.get<{ datos: CajaAPI }>(`${baseUrlCaja}/${id}`).then((respuesta) =>
        cajaFromApi(respuesta.datos)
    );

export const getCajas = async (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
): RespuestaLista<Caja> => {
    const almacenId = almacenLocal.obtener()?.id ?? "";
    const filtroCombinado = [
        ...filtro,
        ["codigo_almacen", almacenId] as ClausulaFiltro
    ];
    const q = criteriaQuery(filtroCombinado, orden, paginacion);
    const respuesta = await RestAPI.get<{ datos: CajaAPI[]; total: number }>(baseUrlCaja + q);
    return { datos: respuesta.datos.map(cajaFromApi), total: respuesta.total };
};

export const postCaja = async (caja: Partial<Caja>): Promise<string> => {
    return await RestAPI.post(baseUrlCaja, caja, "Error al guardar Caja").then(
        (respuesta) => respuesta.id
    );
};

export const patchCaja = async (id: string, caja: Partial<Caja>): Promise<void> => {
    const apiCaja = cajaToApi(caja as Caja);
    const cajaSinNulls = Object.fromEntries(
        Object.entries(apiCaja).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${baseUrlCaja}/${id}`, cajaSinNulls, "Error al guardar Caja");
};

export const deleteCaja = async (id: string): Promise<void> => {
    await RestAPI.delete(`${baseUrlCaja}/${id}`, "Error al borrar Caja");
};

export const postLineaCaja = async (caja: Caja, sku: string, cantidad: string) => {
    const cajaConLinea = {
        id: caja.id,
        caja_origen: "",
        caja_destino: caja.id,
        almacen_destino_id: caja.codigo_almacen,
        almacen_origen_id: "",
        sku,
        cantidad: Number(cantidad),
    };
    return await RestAPI.post(baseUrlTransferencia + "/caja", cajaConLinea, "Error al guardar articulo en caja").then(
        (respuesta) => respuesta.id
    );
};

export const deleteLineaCaja = async (id: string): Promise<void> => {
    await RestAPI.delete(`${baseUrlTransferencia}/${id}`, "Error al borrar linea de caja");
};

export const getMovimientosCaja = async (id: string): RespuestaLista<MovimientoCaja> => {
    return await RestAPI.get<{ datos: MovimientoCaja[] }>(
        `${baseUrlCaja}/${id}/movimientos`
    ).then((respuesta) => {
        const movimientos = respuesta.datos.map((d) => d);
        return { datos: movimientos, total: movimientos.length };
    });
};