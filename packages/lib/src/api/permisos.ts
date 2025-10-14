import { Entidad } from "../diseño.ts";

export interface Permiso extends Entidad {
    id: string;
    id_regla: string;
    id_grupo: string;
    valor: boolean | null;
}

export const permisosGrupo = {
    actualizar: (permisosGrupo: Permiso[]) => localStorage.setItem("permisos-grupo", JSON.stringify(permisosGrupo)),
    obtener: () => localStorage.getItem("permisos-grupo"),
    eliminar: () => localStorage.removeItem("permisos-grupo"),
};