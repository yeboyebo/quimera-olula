import { MetaModelo, stringNoVacio } from "../../../../src/contextos/comun/dominio.ts";
import { tokenAcceso, tokenRefresco } from '../login/infraestructura.ts';
import { Usuario } from "./diseño";
import { logout as logoutAPI } from './infraestructura.ts';


export const logout = async () => {
    const token = tokenRefresco.obtener();
    if (!token) return;

    return logoutAPI(token).then(() => {
        tokenAcceso.eliminar();
        tokenRefresco.eliminar();
    });
}

export const usuarioVacio: Usuario = {
    id: "",
    nombre: "",
    grupo_id: "",
};

export const metaUsuario: MetaModelo<Usuario> = {
    campos: {
        nombre: { requerido: true, validacion: (m: Usuario) => stringNoVacio(m.nombre) },
        grupo_id: { requerido: false },
        estado: { requerido: true },
    },
};

export const nuevoUsuarioVacio: Partial<Usuario> = {
    nombre: "",
    grupo_id: "",
};

export const metaNuevoUsuario: MetaModelo<Partial<Usuario>> = {
    campos: {
        nombre: { requerido: true, validacion: (m) => stringNoVacio(m.nombre || "") },
        grupo_id: { requerido: false },
        estado: { requerido: true },
    },
};
