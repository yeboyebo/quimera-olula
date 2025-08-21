import { RestAPI } from "../../comun/api/rest_api.ts";
import { RespuestaLista2 } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Logout } from "../login/diseño.ts";
import { GetUsuarios, Usuario, UsuarioApi } from "./diseño.ts";


const baseUrl = '/auth';
const baseUrlUsuario = `/auth/usuario`;

const usuarioFromAPI = (c: UsuarioApi): Usuario => ({
    ...c,
});

export const logout: Logout = async (tokenRefresco: string) => {
    const payload = { token: tokenRefresco };
    RestAPI.post(`${baseUrl}/logout`, payload);
}


export const getUsuarios: GetUsuarios = async (filtro, orden, paginacion) => {

    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<RespuestaLista2<Usuario>>(baseUrlUsuario + q);

    return { datos: respuesta.datos.map(usuarioFromAPI), total: respuesta.total };
};