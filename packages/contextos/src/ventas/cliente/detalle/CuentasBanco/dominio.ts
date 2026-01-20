import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.js";
import { CuentaBanco, NuevaCuentaBanco } from "../../diseño.ts";
import {
    deleteCuentaBanco,
    desmarcarCuentaDomiciliacion,
    domiciliarCuenta,
    getCuentasBanco,
    patchCuentaBanco,
    postCuentaBanco,
} from "../../infraestructura.ts";
import { ContextoCuentasBanco, EstadoCuentasBanco } from "./diseño.ts";

export const metaCuentaBanco: MetaModelo<CuentaBanco> = {
    campos: {
        iban: { requerido: true },
        bic: { requerido: true },
    }
};

export const metaNuevaCuentaBanco: MetaModelo<NuevaCuentaBanco> = {
    campos: {
        cuenta: { requerido: true },
    }
};

export const nuevaCuentaBancoVacia: NuevaCuentaBanco = {
    descripcion: '',
    iban: '',
    bic: '',
}

export const metaTablaCuentasBanco = [
    { id: "descripcion", cabecera: "Descripcion" },
    { id: "iban", cabecera: "IBAN" },
    { id: "bic", cabecera: "BIC" },
];

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
        'lista'
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
        cuentaActiva: null,
        estado: "lista"
    }
}

export const cancelarEdicion: ProcesarCuentasBanco = async (contexto) => {
    return {
        ...contexto,
        cuentaActiva: null,
        estado: "lista"
    }
}

export const cancelarConfirmacion: ProcesarCuentasBanco = async (contexto) => {
    return contexto;
}
