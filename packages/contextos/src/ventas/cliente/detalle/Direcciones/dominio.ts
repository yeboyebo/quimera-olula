import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos } from "@olula/lib/dominio.js";
import { DirCliente } from "../../diseño.ts";
import { getDirecciones, setDirFacturacion } from "../../infraestructura.ts";
import { ContextoDirecciones, EstadoDirecciones } from "./diseño.ts";

export { metaNuevaDireccion, nuevaDireccionVacia } from "../../crear_direccion/dominio.ts";
export { metaDireccion } from "../../editar_direccion/dominio.ts";

type ProcesarDirecciones = ProcesarContexto<EstadoDirecciones, ContextoDirecciones>;

const pipeDirecciones = ejecutarListaProcesos<EstadoDirecciones, ContextoDirecciones>;

export const cargarDirecciones: ProcesarDirecciones = async (contexto) => {
    const direcciones = await getDirecciones(contexto.clienteId);
    return {
        ...contexto,
        direcciones,
        cargando: false,
    }
}

export const activarDireccion: ProcesarDirecciones = async (contexto, payload) => {
    const direccionActiva = payload as DirCliente;
    return {
        ...contexto,
        direccionActiva
    }
}

export const cancelarAlta: ProcesarDirecciones = async (contexto) => {
    return {
        ...contexto,
        direccionActiva: null,
        estado: "lista"
    }
}

export const cancelarEdicion: ProcesarDirecciones = async (contexto) => {
    return {
        ...contexto,
        direccionActiva: null,
        estado: "lista"
    }
}

export const cancelarConfirmacion: ProcesarDirecciones = async (contexto) => {
    return {
        ...contexto,
        estado: "lista"
    }
}

export const direccionCreada: ProcesarDirecciones = async (contexto) => {
    return pipeDirecciones(contexto, [
        cargarDirecciones,
        "lista"
    ]);
}

export const direccionActualizada: ProcesarDirecciones = async (contexto) => {
    return pipeDirecciones(contexto, [
        cargarDirecciones,
        "lista"
    ]);
}

export const borrarDireccion: ProcesarDirecciones = async (contexto) => {
    return pipeDirecciones(contexto, [
        cargarDirecciones,
        "lista"
    ]);
}

export const puedoMarcarDireccionFacturacion = (direccion: DirCliente) => {
    return !direccion.dir_facturacion;
}

export const marcarDireccionFacturacion: ProcesarDirecciones = async (contexto) => {
    if (!contexto.direccionActiva?.id) return contexto;

    await setDirFacturacion(contexto.clienteId, contexto.direccionActiva.id);

    return pipeDirecciones(contexto, [
        cargarDirecciones,
    ]);
}
