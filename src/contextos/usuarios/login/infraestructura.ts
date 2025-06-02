import { RestAPI } from "../../comun/api/rest_api.ts";
import { Login, Logout, RefrescarToken, UsuarioLogin, UsuarioRefresco } from "./diseño.ts";

const baseUrl = '/auth';

type PeticionLogin = { id: string; contraseña: string; };
type RespuestaLogin = { token_acceso: string; token_refresco: string; };

export const login: Login = async (id: string, contraseña: string) => {
    const payload = { id, contraseña: btoa(contraseña) };
    const callback: (_: RespuestaLogin) => UsuarioLogin = (respuesta) => ({ id: "_", tokenAcceso: respuesta.token_acceso, tokenRefresco: respuesta.token_refresco });

    return RestAPI.post<PeticionLogin>(`${baseUrl}/login`, payload).then(callback as unknown as (_: { id: string; }) => UsuarioLogin);
}

type RespuestaRefresco = { token_acceso: string; };
export const refrescarToken: RefrescarToken = async (tokenRefresco: string) => {
    const callback: (_: RespuestaRefresco) => UsuarioRefresco = (respuesta) => ({ id: "_", tokenAcceso: respuesta.token_acceso as string });

    return RestAPI.get<RespuestaRefresco>(`${baseUrl}/refresh/${tokenRefresco}`).then(callback);
}

export const logout: Logout = async (tokenRefresco: string) => {
    return RestAPI.delete(`${baseUrl}/logout/${tokenRefresco}`);
}

export const tokenAcceso = {
    actualizar: (tokenAcceso: string) => localStorage.setItem("token-acceso", tokenAcceso),
    obtener: () => localStorage.getItem("token-acceso"),
    eliminar: () => localStorage.removeItem("token-acceso"),
}

export const tokenRefresco = {
    actualizar: (tokenRefresco: string) => localStorage.setItem("token-refresco", tokenRefresco),
    obtener: () => localStorage.getItem("token-refresco"),
    eliminar: () => localStorage.removeItem("token-refresco"),
}
