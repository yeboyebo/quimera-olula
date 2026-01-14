import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos } from "@olula/lib/dominio.js";
import { CuentaBanco } from "../../../diseño.ts";
import {
    deleteCuentaBanco,
    desmarcarCuentaDomiciliacion,
    domiciliarCuenta,
    getCuentasBanco,
    patchCuentaBanco,
    postCuentaBanco,
} from "../../../infraestructura.ts";
import { ContextoCuentasBanco, EstadoCuentasBanco } from "./diseño.ts";

type ProcesarCuentasBanco = ProcesarContexto<EstadoCuentasBanco, ContextoCuentasBanco>;

const pipeCuentasBanco = ejecutarListaProcesos<EstadoCuentasBanco, ContextoCuentasBanco>;

export const cargarCuentasBanco: ProcesarCuentasBanco = async (contexto) => {
    const cuentas = await getCuentasBanco(contexto.clienteId);
    return {
        ...contexto,
        cuentas,
        cargando: false,
    }
}

export const activarCuenta: ProcesarCuentasBanco = async (contexto, payload) => {
    const cuentaActiva = payload as CuentaBanco;
    return {
        ...contexto,
        cuentaActiva
    }
}

export const crearCuenta: ProcesarCuentasBanco = async (contexto, payload) => {
    const nuevaCuenta = payload as CuentaBanco;
    await postCuentaBanco(contexto.clienteId, nuevaCuenta);

    return pipeCuentasBanco(contexto, [
        cargarCuentasBanco,
    ]);
}

export const actualizarCuenta: ProcesarCuentasBanco = async (contexto, payload) => {
    const cuentaActualizada = payload as CuentaBanco;
    await patchCuentaBanco(contexto.clienteId, cuentaActualizada);

    return pipeCuentasBanco(contexto, [
        cargarCuentasBanco,
    ]);
}

export const borrarCuenta: ProcesarCuentasBanco = async (contexto) => {
    const idCuenta = contexto.cuentaActiva?.id;
    if (!idCuenta) return contexto;

    await deleteCuentaBanco(contexto.clienteId, idCuenta);

    return pipeCuentasBanco(contexto, [
        cargarCuentasBanco,
    ]);
}

export const domiciliarCuentaProceso: ProcesarCuentasBanco = async (contexto) => {
    if (!contexto.cuentaActiva?.id) return contexto;

    await domiciliarCuenta(contexto.clienteId, contexto.cuentaActiva.id);

    return pipeCuentasBanco(contexto, [
        cargarCuentasBanco,
    ]);
}

export const desmarcarDomiciliacionProceso: ProcesarCuentasBanco = async (contexto) => {
    await desmarcarCuentaDomiciliacion(contexto.clienteId);

    return pipeCuentasBanco(contexto, [
        cargarCuentasBanco,
    ]);
}

export const cancelarAlta: ProcesarCuentasBanco = async (contexto) => {
    return {
        ...contexto,
        cuentaActiva: null
    }
}

export const cancelarEdicion: ProcesarCuentasBanco = async (contexto) => {
    return {
        ...contexto,
        cuentaActiva: null
    }
}

export const cancelarConfirmacion: ProcesarCuentasBanco = async (contexto) => {
    return contexto;
}
