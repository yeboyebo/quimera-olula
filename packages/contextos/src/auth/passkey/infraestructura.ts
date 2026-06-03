import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { UsuarioLogin } from "../login/diseño.ts";
import { FinalizarAutenticacion, FinalizarRegistro, IniciarAutenticacion, IniciarRegistro, RespuestaIniciarAutenticacion } from "./diseño.ts";

const baseUrl = "/auth/passkey";

type RespuestaLogin = { token_acceso: string; token_refresco: string };
type PeticionCredential = { credential: string };

export const iniciarRegistroAPI: IniciarRegistro = (email: string) =>
    RestAPI.post(`${baseUrl}/registro/iniciar`, { email }) as Promise<unknown>;

export const finalizarRegistroAPI: FinalizarRegistro = (credential: string) =>
    RestAPI.post<PeticionCredential>(`${baseUrl}/registro/finalizar`, { credential })
        .then(() => undefined);

export const iniciarAutenticacionAPI: IniciarAutenticacion = () =>
    RestAPI.post(`${baseUrl}/autenticacion/iniciar`, {}) as Promise<RespuestaIniciarAutenticacion>;

export const finalizarAutenticacionAPI: FinalizarAutenticacion = (credential: string, session_id: string) => {
    const callback = (respuesta: RespuestaLogin): UsuarioLogin => ({
        id: "_",
        tokenAcceso: respuesta.token_acceso,
        tokenRefresco: respuesta.token_refresco,
    });
    return RestAPI.post<{ credential: string; session_id: string }>(
        `${baseUrl}/autenticacion/finalizar`,
        { credential, session_id }
    ).then(callback as unknown as (_: { id: string }) => UsuarioLogin);
};
