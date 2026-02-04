import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.js";
import { accionesListaEntidades, ProcesarListaEntidades } from "@olula/lib/ListaEntidades.js";
import { CuentaBanco, NuevaCuentaBanco } from "../../diseño.ts";
import {
    desmarcarCuentaDomiciliacion,
    domiciliarCuenta,
    getCuentasBanco,
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

const conCuentas = (fn: ProcesarListaEntidades<CuentaBanco>) =>
    (ctx: ContextoCuentasBanco) => ({ ...ctx, cuentas: fn(ctx.cuentas) });

export const Cuentas = accionesListaEntidades(conCuentas);

export const recargarCuentas: ProcesarCuentasBanco = async (contexto, payload) => {
    const clienteId = (payload as string) || contexto.clienteId;
    const resultado = await getCuentasBanco(clienteId);
    const contextoActualizado = await Cuentas.recargar(contexto, { datos: resultado, total: resultado.length });
    return {
        ...contextoActualizado,
        clienteId,
        cargando: false,
    }
}

export const domiciliarCuentaProceso: ProcesarCuentasBanco = async (contexto) => {
    if (!contexto.cuentas.activo?.id) return contexto;

    await domiciliarCuenta(contexto.clienteId, contexto.cuentas.activo.id);

    return pipeCuentasBanco(contexto, [
        recargarCuentas,
    ]);
}

export const desmarcarDomiciliacionProceso: ProcesarCuentasBanco = async (contexto) => {
    await desmarcarCuentaDomiciliacion(contexto.clienteId);

    return pipeCuentasBanco(contexto, [
        recargarCuentas,
    ]);
}
