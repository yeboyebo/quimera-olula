import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos } from "@olula/lib/dominio.js";
import { DirCliente } from "../../diseño.ts";
import {
    actualizarDireccion as actualizarDireccionAPI,
    deleteDireccion,
    getDirecciones,
    postDireccion,
    setDirFacturacion,
} from "../../infraestructura.ts";
import { ContextoDirecciones, EstadoDirecciones } from "./diseño.ts";

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

export const crearDireccion: ProcesarDirecciones = async (contexto, payload) => {
    const nuevaDireccion = payload as DirCliente;
    await postDireccion(contexto.clienteId, nuevaDireccion);

    return pipeDirecciones(contexto, [
        cargarDirecciones,
    ]);
}

export const actualizarDireccion: ProcesarDirecciones = async (contexto, payload) => {
    const direccionActualizada = payload as DirCliente;
    await actualizarDireccionAPI(contexto.clienteId, direccionActualizada);

    return pipeDirecciones(contexto, [
        cargarDirecciones,
        'lista'
    ]);
}

export const borrarDireccion: ProcesarDirecciones = async (contexto, _payload) => {
    const idDireccion = contexto.direccionActiva?.id;
    if (!idDireccion) return contexto;

    await deleteDireccion(contexto.clienteId, idDireccion);

    return pipeDirecciones(contexto, [
        cargarDirecciones,
        'lista'
    ]);
}

export const marcarDireccionFacturacion: ProcesarDirecciones = async (contexto) => {
    if (!contexto.direccionActiva?.id) return contexto;

    await setDirFacturacion(contexto.clienteId, contexto.direccionActiva.id);

    return pipeDirecciones(contexto, [
        cargarDirecciones,
    ]);
}

export const cancelarAlta: ProcesarDirecciones = async (contexto) => {
    return {
        ...contexto,
        direccionActiva: null
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
    return contexto;
}
