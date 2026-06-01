import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { tokenAcceso, tokenRefresco } from "../login/infraestructura.ts";
import {
    finalizarAutenticacionAPI,
    finalizarRegistroAPI,
    iniciarAutenticacionAPI,
    iniciarRegistroAPI,
} from "./infraestructura.ts";

export const registrarPasskey = async (email: string): Promise<void> => {
    const opciones = await iniciarRegistroAPI(email);
    const resultado = await startRegistration({ optionsJSON: opciones as never });
    await finalizarRegistroAPI(JSON.stringify(resultado));
};

export const autenticarConPasskey = async (): Promise<{ tokenAcceso: string; tokenRefresco: string }> => {
    const opciones = await iniciarAutenticacionAPI();
    const resultado = await startAuthentication({ optionsJSON: opciones as never });
    const datosLogin = await finalizarAutenticacionAPI(JSON.stringify(resultado));

    tokenAcceso.actualizar(datosLogin.tokenAcceso);
    tokenRefresco.actualizar(datosLogin.tokenRefresco);

    return datosLogin;
};
