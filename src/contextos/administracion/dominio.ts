import { useLista } from "../comun/useLista.ts";
import { Grupo, Permiso, Regla } from "./diseño.ts";

export const grupoVacio: Grupo = {
    id: "",
    descripcion: "",
};

export const reglaVacia: Regla = {
    id: "",
    descripcion: "",
    grupo: "",
};

export const validadoresGrupo = {
    id: (valor: string) => valor.trim() !== "",
    descripcion: (valor: string) => valor.trim() !== "",
};

export const validadoresRegla = {
    id: (valor: string) => valor.trim() !== "",
    descripcion: (valor: string) => valor.trim() !== "",
    grupo: (valor: string) => valor.trim() !== "",
};

export const obtenerTextoYClaseAccion = (accion: string) => {
    switch (accion) {
        case "get":
            return { texto: "Lectura", clase: "accion-get" };
        case "post":
            return { texto: "Creación", clase: "accion-post" };
        case "patch":
            return { texto: "Modificación", clase: "accion-patch" };
        case "delete":
            return { texto: "Eliminación", clase: "accion-delete" };
        default:
            return { texto: accion || "General", clase: "accion-default" };
    }
};

export const obtenerSubreglas = (reglas: Regla[], reglaBaseId: string): Regla[] => {
    return reglas.filter((regla) => regla.id.startsWith(`${reglaBaseId}/`));
};

export const obtenerReglasAgrupadas = (reglas: Regla[]): Regla[] => {
    return reglas.filter((regla) => !regla.id.includes("/"));
};

export const actualizarPermiso = (
    permisos: ReturnType<typeof useLista<Permiso>>,
    reglaId: string,
    grupoId: string,
    value: boolean | null
) => {
    const permisoExistente = permisos.lista.find(
        (permiso) =>
            permiso.idrule === reglaId && permiso.id.toUpperCase() === grupoId.toUpperCase()
    );

    if (permisoExistente) {
        permisos.modificar({ ...permisoExistente, value });
    } else {
        permisos.añadir({
            idpermission: Date.now(),
            idrule: reglaId,
            id: grupoId,
            value,
        });
    }
};

export const calcularPermiso = (
    permisos: Permiso[],
    grupoId: string,
    reglaId: string
): "true" | "false" | "null" => {
    const permisoActual = permisos.find(
        (p) =>
            p.id.toUpperCase() === grupoId.toUpperCase() && p.idrule === reglaId
    );
    return permisoActual
        ? permisoActual.value === true
            ? "true"
            : permisoActual.value === false
                ? "false"
                : "null"
        : "null";
};

export const calcularClasesExtra = (reglaId: string): string => {
    if (!reglaId.includes("/")) {
        return "";
    }

    const esAccion = !["/get", "/patch", "/post", "/delete"].some((accion) =>
        reglaId.includes(accion)
    );
    return esAccion ? "accion" : "";
};
