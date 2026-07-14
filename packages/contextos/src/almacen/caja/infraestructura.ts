import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Entidad } from "@olula/lib/diseño.js";
import {
    Caja,
    CajaContenido,
    CambiosCaja,
    ComponenteCaja,
    DeleteCaja,
    GetCaja,
    GetCajas,
    NuevaCaja,
    PatchCaja,
    PostCaja,
} from "./diseño.ts";

interface CajaAPI extends Entidad {
    id: string;
    lpn: string;
    ubicacion_id: string;
    contenedor_id?: string | null;
}

interface MovimientoCajaAPI {
    id: string;
    sku: string;
    descripcion: string;
    cantidad: number;
}

interface CajaContenidoAPI extends CajaAPI {
    contenido: ComponenteCajaAPI[];
}
type ComponenteCajaAPI = CajaContenidoAPI | MovimientoCajaAPI;

interface NuevaCajaAPI {
    ubicacion_id: string;
    contenedor_id?: string | null;
}

type CambiosCajaAPI = Partial<CajaAPI>;

const baseUrl = `/almacen/caja`;

const esMaterialAPI = (comp: ComponenteCajaAPI): comp is MovimientoCajaAPI =>
    "sku" in comp;

const componenteDesdeApi = (comp: ComponenteCajaAPI): ComponenteCaja => {
    if (esMaterialAPI(comp)) {
        return {
            id: comp.id,
            sku: comp.sku,
            descripcion: comp.descripcion,
            cantidad: comp.cantidad,
        };
    }
    return cajaContenidoDesdeApi(comp);
};

export const cajaDesdeApi = (cajaApi: CajaAPI): Caja => ({
    id: cajaApi.id,
    lpn: cajaApi.lpn,
    ubicacionId: cajaApi.ubicacion_id,
    ubicacion: cajaApi.ubicacion,
    contenedorId: cajaApi.contenedor_id,
    contenedor: cajaApi.contenedor,
});

const cajaContenidoDesdeApi = (cajaApi: CajaContenidoAPI): CajaContenido => ({
    id: cajaApi.id,
    lpn: cajaApi.lpn,
    ubicacionId: cajaApi.ubicacion_id,
    contenedorId: cajaApi.contenedor_id,
    contenido: cajaApi.contenido.map(componenteDesdeApi),
});

const nuevaCajaAApi = (caja: NuevaCaja): NuevaCajaAPI => ({
    ubicacion_id: caja.ubicacionId,
    contenedor_id: caja.contenedorId,
});

const cambiosCajaAApi = (cambios: CambiosCaja): CambiosCajaAPI => {
    const api: CambiosCajaAPI = {};
    if (cambios.ubicacionId !== undefined) api.ubicacion_id = cambios.ubicacionId;
    if (cambios.contenedorId !== undefined) api.contenedor_id = cambios.contenedorId;
    return api;
};

export const getCaja: GetCaja = async (id) => {
    return await RestAPI.getItem<CajaContenido, CajaContenidoAPI>(
        `${baseUrl}/${id}`,
        cajaContenidoDesdeApi,
    );
};

export const getCajas: GetCajas = async (criteria) => {
    return await RestAPI.getQuery<Caja, CajaAPI>(
        baseUrl,
        criteria,
        cajaDesdeApi,
    );
};

export const postCaja: PostCaja = async (nuevaCaja) => {
    const respuesta = await RestAPI.post<NuevaCajaAPI>(
        baseUrl,
        nuevaCajaAApi(nuevaCaja),
        "Error al crear caja"
    );
    return respuesta.id;
};

export const patchCaja: PatchCaja = async (id, cambios) => {
    await RestAPI.patch<CambiosCajaAPI>(
        `${baseUrl}/${id}`,
        cambiosCajaAApi(cambios),
        "Error al guardar caja"
    );
};

export const deleteCaja: DeleteCaja = async (id) => {
    await RestAPI.delete(
        `${baseUrl}/${id}`,
        "Error al borrar caja"
    );
};
