import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos } from "@olula/lib/dominio.js";
import { DirCliente } from "../../../diseño.ts";
import {
    deleteDireccion,
    getDirecciones,
    setDirFacturacion,
} from "../../../infraestructura.ts";
import { ContextoDirecciones, EstadoDirecciones } from "./tipos.ts";

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
    console.log("Activando direccion con payload:", payload);
    const direccionActiva = payload as DirCliente;
    return {
        ...contexto,
        direccionActiva
    }
}

export const crearDireccion: ProcesarDirecciones = async (contexto, _payload) => {
    return pipeDirecciones(contexto, [
        cargarDirecciones,
    ]);
}

export const actualizarDireccion: ProcesarDirecciones = async (contexto, _payload) => {
    return pipeDirecciones(contexto, [
        cargarDirecciones,
    ]);
}

export const borrarDireccion: ProcesarDirecciones = async (contexto, _payload) => {
    const idDireccion = contexto.direccionActiva?.id;
    if (!idDireccion) return contexto;

    await deleteDireccion(contexto.clienteId, idDireccion);

    return pipeDirecciones(contexto, [
        cargarDirecciones,
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
        direccionActiva: null
    }
}

export const cancelarConfirmacion: ProcesarDirecciones = async (contexto) => {
    return contexto;
}
