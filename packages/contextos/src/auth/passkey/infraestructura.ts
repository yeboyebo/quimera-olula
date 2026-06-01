import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { UsuarioLogin } from "../login/diseño.ts";
import { FinalizarAutenticacion, FinalizarRegistro, IniciarAutenticacion, IniciarRegistro } from "./diseño.ts";

const baseUrl = "/auth/passkey";

type RespuestaLogin = { token_acceso: string; token_refresco: string };
type PeticionCredential = { credential: string };

export const iniciarRegistroAPI: IniciarRegistro = (email: string) =>
    RestAPI.post(`${baseUrl}/registro/iniciar`, { email }) as Promise<unknown>;

export const finalizarRegistroAPI: FinalizarRegistro = (credential: string) =>
    RestAPI.post<PeticionCredential>(`${baseUrl}/registro/finalizar`, { credential })
        .then(() => undefined);

export const iniciarAutenticacionAPI: IniciarAutenticacion = () =>
    RestAPI.post(`${baseUrl}/autenticacion/iniciar`, {}) as Promise<unknown>;

export const finalizarAutenticacionAPI: FinalizarAutenticacion = (credential: string) => {
    const callback = (respuesta: RespuestaLogin): UsuarioLogin => ({
        id: "_",
        tokenAcceso: respuesta.token_acceso,
        tokenRefresco: respuesta.token_refresco,
    });
    return RestAPI.post<PeticionCredential>(`${baseUrl}/autenticacion/finalizar`, { credential })
        .then(callback as unknown as (_: { id: string }) => UsuarioLogin);
};
