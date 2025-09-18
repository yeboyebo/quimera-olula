import { RestAPI } from "../../../../src/contextos/comun/api/rest_api.ts";
import ApiUrls from "../../../../src/contextos/comun/api/urls.ts";
import { criteriaQuery } from "../../../../src/contextos/comun/infraestructura.ts";
import {
    DeleteModulo,
    GetModulo,
    GetModulos,
    Modulo,
    ModuloAPI,
    PatchModulo,
    PostModulo
} from "./diseño.ts";

const baseUrlModulo = ApiUrls.COMUN_PAIS;

export const moduloFromApi = (moduloApi: ModuloAPI): Modulo => ({
    ...moduloApi,
});

export const moduloToApi = (modulo: Modulo): ModuloAPI => ({
    ...modulo,
});

export const getModulo: GetModulo = async (id) =>
    await RestAPI.get<{ datos: ModuloAPI }>(`${baseUrlModulo}/${id}`).then((respuesta) =>
        moduloFromApi(respuesta.datos)
    );

export const getModulos: GetModulos = async (
    filtro,
    orden,
    paginacion?
) => {
    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<{ datos: ModuloAPI[]; total: number }>(baseUrlModulo + q);
    return { datos: respuesta.datos.map(moduloFromApi), total: respuesta.total };
};

export const postModulo: PostModulo = async (modulo) => {
    return await RestAPI.post(baseUrlModulo, modulo, "Error al guardar Modulo").then(
        (respuesta) => respuesta.id
    );
};

export const patchModulo: PatchModulo = async (id, modulo) => {
    const apiModulo = moduloToApi(modulo as Modulo);
    const moduloSinNulls = Object.fromEntries(
        Object.entries(apiModulo).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${baseUrlModulo}/${id}`, moduloSinNulls, "Error al guardar Modulo");
};

export const deleteModulo: DeleteModulo = async (id) => {
    await RestAPI.delete(`${baseUrlModulo}/${id}`, "Error al borrar Modulo");
};

