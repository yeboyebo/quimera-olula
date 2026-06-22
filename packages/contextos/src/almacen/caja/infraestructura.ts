import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.js";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import {
    Caja,
    CajaAPI,
    CajaContenido,
    CajaContenidoAPI,
    ComponenteCaja,
    ComponenteCajaAPI,
    MovimientoCajaAPI,
} from "./diseño.ts";

const baseUrlCaja = `/almacen/caja`;

export const cajaFromApi = (cajaApi: CajaAPI): Caja => ({
    id: cajaApi.id,
    ubicacionId: cajaApi.ubicacion_id,
    contenedorId: cajaApi.contenedor_id,
});

export const cajaToApi = (caja: Caja): CajaAPI => ({
    id: caja.id,
    ubicacion_id: caja.ubicacionId,
    contenedor_id: caja.contenedorId,
});

const esMaterialAPI = (comp: ComponenteCajaAPI): comp is MovimientoCajaAPI =>
    "sku" in comp;

export const componenteFromApi = (comp: ComponenteCajaAPI): ComponenteCaja => {
    if (esMaterialAPI(comp)) {
        return {
            id: comp.id,
            sku: comp.sku,
            descripcion: comp.descripcion,
            cantidad: comp.cantidad,
        };
    }
    return cajaContenidoFromApi(comp);
};

export const cajaContenidoFromApi = (cajaApi: CajaContenidoAPI): CajaContenido => ({
    id: cajaApi.id,
    ubicacionId: cajaApi.ubicacion_id,
    contenedorId: cajaApi.contenedor_id,
    contenido: cajaApi.contenido.map(componenteFromApi),
});

export const getCaja = async (id: string): Promise<CajaContenido> =>
    await RestAPI.get<{ datos: CajaContenidoAPI }>(`${baseUrlCaja}/${id}`).then(
        (respuesta) => cajaContenidoFromApi(respuesta.datos)
    );

export const getCajas = async (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
): RespuestaLista<Caja> => {
    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<{ datos: CajaAPI[]; total: number }>(baseUrlCaja + q);
    return { datos: respuesta.datos.map(cajaFromApi), total: respuesta.total };
};

export const postCaja = async (caja: Partial<Caja>): Promise<string> => {
    const apiCaja = {
        id: caja.id,
        ubicacion_id: caja.ubicacionId,
        contenedor_id: caja.contenedorId,
    };
    return await RestAPI.post(baseUrlCaja, apiCaja, "Error al guardar Caja").then(
        (respuesta) => respuesta.id
    );
};

export const patchCaja = async (id: string, caja: Partial<Caja>): Promise<void> => {
    const apiCaja: Partial<CajaAPI> = {};
    if (caja.ubicacionId !== undefined) apiCaja.ubicacion_id = caja.ubicacionId;
    if (caja.contenedorId !== undefined) apiCaja.contenedor_id = caja.contenedorId;
    await RestAPI.patch(`${baseUrlCaja}/${id}`, apiCaja, "Error al guardar Caja");
};

export const deleteCaja = async (id: string): Promise<void> => {
    await RestAPI.delete(`${baseUrlCaja}/${id}`, "Error al borrar Caja");
};
