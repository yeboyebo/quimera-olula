import { RestAPI } from "@olula/lib/api/rest_api.ts";
import ComunUrls from "../urls.ts";
import {
    CambiosCredencialExterna, CategoriaCredencialExterna, CredencialExterna, DeleteCredencialExterna,
    GetCredencialesExterna, GetCredencialExterna, PatchCredencialExterna, PostCredencialExterna,
    RotarSecretoCredencialExterna, SecretoCredencialExterna, TipoAuthCredencialExterna,
} from "./diseño.ts";

export interface CredencialExternaApi {
    id: string;
    empresa_id: string;
    nombre: string;
    proveedor: string;
    tipo_auth: TipoAuthCredencialExterna;
    activo: boolean;
    creado_por: string;
    creado_en: string;
    actualizado_en: string;
    propietario_id: string | null;
    categoria: CategoriaCredencialExterna;
}

interface NuevaCredencialExternaApi {
    empresa_id: string;
    nombre: string;
    proveedor: string;
    tipo_auth: TipoAuthCredencialExterna;
    secreto: SecretoCredencialExterna;
    personal: boolean;
    categoria: CategoriaCredencialExterna;
}

type CambiosCredencialExternaApi = Partial<{
    nombre: string;
    proveedor: string;
    activo: boolean;
    secreto: SecretoCredencialExterna;
}>;

const baseUrl = new ComunUrls().CREDENCIAL_EXTERNA;

export const credencialExternaDesdeApi = (api: CredencialExternaApi): CredencialExterna => ({
    id: api.id,
    empresaId: api.empresa_id,
    nombre: api.nombre,
    proveedor: api.proveedor,
    tipoAuth: api.tipo_auth,
    activo: api.activo,
    creadoPor: api.creado_por,
    creadoEn: new Date(Date.parse(api.creado_en)),
    actualizadoEn: new Date(Date.parse(api.actualizado_en)),
    propietarioId: api.propietario_id,
    categoria: api.categoria,
});

const cambiosCredencialExternaAApi = (m: CambiosCredencialExterna): CambiosCredencialExternaApi => {
    const cambios: CambiosCredencialExternaApi = {};
    if (m.nombre !== undefined) cambios.nombre = m.nombre;
    if (m.proveedor !== undefined) cambios.proveedor = m.proveedor;
    if (m.activo !== undefined) cambios.activo = m.activo;
    return cambios;
};

export const getCredencialExterna: GetCredencialExterna = async (id) => {
    return await RestAPI.getItem<CredencialExterna, CredencialExternaApi>(
        `${baseUrl}/${id}`,
        credencialExternaDesdeApi,
    );
};

export const getCredencialesExterna: GetCredencialesExterna = async (criteria) => {
    return await RestAPI.getQuery<CredencialExterna, CredencialExternaApi>(
        baseUrl,
        criteria,
        credencialExternaDesdeApi,
    );
};

export const postCredencialExterna: PostCredencialExterna = async (nuevaCredencial, secreto) => {
    const respuesta = await RestAPI.post<NuevaCredencialExternaApi>(
        baseUrl,
        {
            empresa_id: nuevaCredencial.empresaId,
            nombre: nuevaCredencial.nombre,
            proveedor: nuevaCredencial.proveedor,
            tipo_auth: nuevaCredencial.tipoAuth,
            secreto,
            personal: nuevaCredencial.personal,
            categoria: nuevaCredencial.categoria,
        },
        "Error al crear la credencial",
    );
    return respuesta.id;
};

export const patchCredencialExterna: PatchCredencialExterna = async (id, cambios) => {
    await RestAPI.patch<CambiosCredencialExternaApi>(
        `${baseUrl}/${id}`,
        cambiosCredencialExternaAApi(cambios),
        "Error al guardar la credencial",
    );
};

export const rotarSecretoCredencialExterna: RotarSecretoCredencialExterna = async (id, secreto) => {
    await RestAPI.patch<CambiosCredencialExternaApi>(
        `${baseUrl}/${id}`,
        { secreto },
        "Error al rotar la credencial",
    );
};

export const deleteCredencialExterna: DeleteCredencialExterna = async (id) => {
    await RestAPI.delete(
        `${baseUrl}/${id}`,
        "Error al eliminar la credencial",
    );
};
