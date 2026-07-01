import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import {
    DeleteUbicacion,
    GetUbicacion,
    GetUbicaciones,
    PatchUbicacion,
    PostUbicacion,
    Ubicacion,
    UbicacionAPI
} from "./diseño.ts";

const baseUrlUbicacion = `/almacen/ubicacion`;

export const ubicacionFromApi = (ubicacionApi: UbicacionAPI): Ubicacion => ({
    id: ubicacionApi.id,
    codigo: ubicacionApi.codigo,
    almacenId: ubicacionApi.almacen_id,
});

export const ubicacionToApi = (ubicacion: Ubicacion): UbicacionAPI => ({
    id: ubicacion.id,
    codigo: ubicacion.codigo,
    almacen_id: ubicacion.almacenId,
});

export const obtenerUbicaciones = async (filtro: Filtro, orden: Orden): Promise<Ubicacion[]> => {
    const q = criteriaQuery(filtro, orden);

    return RestAPI.get<{ datos: UbicacionAPI[] }>(baseUrlUbicacion + q).then((respuesta) => respuesta.datos.map(ubicacionFromApi));
}

export const getUbicacion: GetUbicacion = async (id) =>
    await RestAPI.get<{ datos: UbicacionAPI }>(`${baseUrlUbicacion}/${id}`).then((respuesta) =>
        ubicacionFromApi(respuesta.datos)
    );

export const getUbicaciones: GetUbicaciones = async (
    filtro,
    orden,
    paginacion?
) => {
    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<{ datos: UbicacionAPI[]; total: number }>(baseUrlUbicacion + q);
    return { datos: respuesta.datos.map(ubicacionFromApi), total: respuesta.total };
};

export const postUbicacion: PostUbicacion = async (ubicacion) => {
    const apiUbicacion = {
        codigo: ubicacion.codigo,
        almacen_id: ubicacion.almacenId,
    };
    return await RestAPI.post(baseUrlUbicacion, apiUbicacion, "Error al guardar Ubicación").then(
        (respuesta) => respuesta.id
    );
};

export const patchUbicacion: PatchUbicacion = async (id, ubicacion) => {
    const apiUbicacion = ubicacionToApi(ubicacion as Ubicacion);
    const ubicacionSinNulls = Object.fromEntries(
        Object.entries(apiUbicacion).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${baseUrlUbicacion}/${id}`, ubicacionSinNulls, "Error al guardar Ubicación");
};

export const deleteUbicacion: DeleteUbicacion = async (id) => {
    await RestAPI.delete(`${baseUrlUbicacion}/${id}`, "Error al borrar Ubicación");
};
