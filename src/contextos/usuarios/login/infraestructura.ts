import { RestAPI } from "../../comun/api/rest_api.ts";
import { ForgetPassword, Login, Usuario } from "./diseño.ts";

const baseUrl = `/usuarios/login`;

type UsuarioApi = {
    iduser: string;
    superuser: boolean;
    token: string;
    email: string;
};;
const usuarioFromAPI = (u: UsuarioApi): Usuario => {
    return { id: u.iduser, superuser: u.superuser, token: u.token, email: u.email };
}

export const loginApi: Login = async (id) =>
    await RestAPI.get<{ datos: UsuarioApi }>(`${baseUrl}/${id}`).then((respuesta) => usuarioFromAPI(respuesta.datos));

export const forgetPassword: ForgetPassword = async (email) => {
    return {
        result: true,
        message: "Se ha enviado un correo a la dirección de email: " + email
    };
}

export const login: Login = async (email, password) => {
    return usuarioFromAPI({
        iduser: "ivan",
        superuser: true,
        token: "1bc9a242fe914c66776eb47639eedbadba8438f6_" + password,
        email
    });
}

export const isLogged = () => {
    const usuario = localStorage.getItem("usuario");
    return usuario !== null && usuario !== undefined;
}