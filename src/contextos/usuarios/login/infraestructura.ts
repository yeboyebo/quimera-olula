import { RestAPI } from "../../comun/api/rest_api.ts";
import { Login, Logout, RefrescarToken, UsuarioLogin, UsuarioRefresco } from "./diseño.ts";

const baseUrl = '/auth';

export const login: Login = async (id: string, contraseña: string) => {
    const payload = { id, contraseña: btoa(contraseña) };
    const callback: (_: UsuarioLogin) => UsuarioLogin = (respuesta) => ({ id: "_", tokenAcceso: respuesta.token_acceso as string, tokenRefresco: respuesta.token_refresco as string });

    return RestAPI.post<{ id: string; contraseña: string }>(`${baseUrl}/login`, payload).then(callback as unknown as (_: { id: string; }) => UsuarioLogin);
}

export const refrescarToken: RefrescarToken = async (tokenRefresco: string) => {
    const payload = { token_refresco: tokenRefresco };
    const callback: (_: UsuarioRefresco) => UsuarioRefresco = (respuesta) => ({ id: "_", tokenAcceso: respuesta.token_acceso as string });

    return RestAPI.post<{ token_refresco: string }>(`${baseUrl}/token`, payload).then(callback as unknown as (_: { id: string; }) => UsuarioRefresco);
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
