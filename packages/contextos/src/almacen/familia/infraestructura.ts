import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import {
    DeleteFamilia,
    Familia,
    FamiliaAPI,
    GetFamilia,
    GetFamilias,
    PatchFamilia,
    PostFamilia
} from "./diseño.ts";

const baseUrlFamilia = `/almacen/familia`;

export const moduloFromApi = (moduloApi: FamiliaAPI): Familia => ({
    ...moduloApi,
});

export const moduloToApi = (modulo: Familia): FamiliaAPI => ({
    ...modulo,
});

export const getFamilia: GetFamilia = async (id) =>
    await RestAPI.get<{ datos: FamiliaAPI }>(`${baseUrlFamilia}/${id}`).then((respuesta) =>
        moduloFromApi(respuesta.datos)
    );

export const getFamilias: GetFamilias = async (
    filtro,
    orden,
    paginacion?
) => {
    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<{ datos: FamiliaAPI[]; total: number }>(baseUrlFamilia + q);
    return { datos: respuesta.datos.map(moduloFromApi), total: respuesta.total };
};

export const postFamilia: PostFamilia = async (modulo) => {
    return await RestAPI.post(baseUrlFamilia, modulo, "Error al guardar Familia").then(
        (respuesta) => respuesta.id
    );
};

export const patchFamilia: PatchFamilia = async (id, modulo) => {
    const apiFamilia = moduloToApi(modulo as Familia);
    const moduloSinNulls = Object.fromEntries(
        Object.entries(apiFamilia).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${baseUrlFamilia}/${id}`, moduloSinNulls, "Error al guardar Familia");
};

export const deleteFamilia: DeleteFamilia = async (id) => {
    await RestAPI.delete(`${baseUrlFamilia}/${id}`, "Error al borrar Familia");
};

