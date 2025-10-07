import { MaestroConDetalleGruposReglas } from '@quimera/ctx/auth/grupos/vistas/MaestroConDetalleGruposReglas.tsx';
import { Login } from '@quimera/ctx/auth/login/vistas/Login';
import { Logout } from '@quimera/ctx/auth/usuario/vistas/Logout';
import { Perfil } from '@quimera/ctx/auth/usuario/vistas/Perfil';
import { MaestroConDetalleUsuario } from "./usuario/vistas/MaestroDetalleUsuario.tsx";


export const routerAuth = {
    "auth/usuario": MaestroConDetalleUsuario,
    "auth/grupo": MaestroConDetalleGruposReglas,
    "login": Login,
    "logout": Logout,
    "usuario/perfil": Perfil,
}