import { login as loginAPI, logout as logoutAPI, refrescarToken as refrescarTokenAPI, tokenAcceso, tokenRefresco } from './infraestructura.ts';

export const login = async (id: string, contraseña: string) => {
    return loginAPI(id, contraseña).then((datosLogin) => {
        tokenAcceso.actualizar(datosLogin.tokenAcceso);
        tokenRefresco.actualizar(datosLogin.tokenRefresco);
    });
}

export const logout = async () => {
    const token = tokenRefresco.obtener();
    if (!token) return;

    return logoutAPI(token).then(() => {
        tokenAcceso.eliminar();
        tokenRefresco.eliminar();
    });
}

export const refrescarToken = async () => {
    const token = tokenRefresco.obtener();
    if (!token) return;

    return refrescarTokenAPI(token).then((datosRefresco) => {
        tokenAcceso.actualizar(datosRefresco.tokenAcceso);
    })
}
