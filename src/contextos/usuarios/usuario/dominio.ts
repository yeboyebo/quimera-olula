import { tokenAcceso, tokenRefresco } from '../login/infraestructura.ts';
import { logout as logoutAPI } from './infraestructura.ts';


export const logout = async () => {
    const token = tokenRefresco.obtener();
    if (!token) return;

    return logoutAPI(token).then(() => {
        tokenAcceso.eliminar();
        tokenRefresco.eliminar();
    });
}

