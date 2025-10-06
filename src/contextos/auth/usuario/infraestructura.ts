import { RestAPI } from "../../comun/api/rest_api.ts";
import { RespuestaLista2 } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Logout } from "../login/diseño.ts";
import { DeleteUsuario, GetUsuario, GetUsuarios, PatchUsuario, PostUsuario, Usuario, UsuarioAPI, UsuarioApi } from "./diseño.ts";


const baseUrl = '/auth';
const baseUrlUsuario = `/auth/usuario`;

export const usuarioFromAPI = (c: UsuarioApi): Usuario => ({
    ...c,
});

export const usuarioToApi = (usuario: Usuario): UsuarioAPI => ({
    ...usuario,
    usuario_id: usuario.id,
});

export const logout: Logout = async (tokenRefresco: string) => {
    const payload = { token: tokenRefresco };
    RestAPI.post(`${baseUrl}/logout`, payload);
}

export const getUsuario: GetUsuario = async (id) =>
    await RestAPI.get<{ datos: UsuarioAPI }>(`${baseUrlUsuario}/${id}`).then((respuesta) =>
        usuarioFromAPI(respuesta.datos)
    );

export const getUsuarios: GetUsuarios = async (filtro, orden, paginacion) => {

    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<RespuestaLista2<Usuario>>(baseUrlUsuario + q);

    return { datos: respuesta.datos.map(usuarioFromAPI), total: respuesta.total };
};

export const postUsuario: PostUsuario = async (usuario) => {
    const apiUsuario = usuarioToApi(usuario as Usuario);
    return await RestAPI.post(baseUrlUsuario, apiUsuario, "Error al guardar Usuario").then(
        (respuesta) => respuesta.id
    );
};

export const patchUsuario: PatchUsuario = async (id, usuario) => {
    const apiUsuario = usuarioToApi(usuario as Usuario);
    const usuarioSinNulls = Object.fromEntries(
        Object.entries(apiUsuario).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${baseUrlUsuario}/${id}`, usuarioSinNulls, "Error al guardar Usuario");
};

export const deleteUsuario: DeleteUsuario = async (id) => {
    await RestAPI.delete(`${baseUrlUsuario}/${id}`, "Error al borrar Usuario");
};