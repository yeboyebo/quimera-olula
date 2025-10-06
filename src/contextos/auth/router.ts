import { MaestroConDetalleGruposReglas } from "./grupos/vistas/MaestroConDetalleGruposReglas.tsx";
import { MaestroConDetalleUsuario } from "./usuario/vistas/MaestroDetalleUsuario.tsx";


export const routerAuth = {
    "auth/usuario": MaestroConDetalleUsuario,
    "auth/grupo": MaestroConDetalleGruposReglas,
}