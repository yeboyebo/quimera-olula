import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { ERR_IBAN_NO_VALIDO, ibanValido } from "@olula/lib/iban.ts";
import { CuentaBancaria } from "../diseño.js";
import { getCuentaBancaria, patchCuentaBancaria } from "../infraestructura.js";
import { ContextoDetalleCuentaBancaria, EstadoDetalleCuentaBancaria } from "./maquina.js";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleCuentaBancaria, ContextoDetalleCuentaBancaria>;

const pipeCuenta = ejecutarListaProcesos<EstadoDetalleCuentaBancaria, ContextoDetalleCuentaBancaria>;

const ibanCuentaValido = (cuenta: CuentaBancaria): boolean | string =>
    !stringNoVacio(cuenta.iban) || ibanValido(cuenta.iban) || ERR_IBAN_NO_VALIDO;

export const metaCuentaBancaria: MetaModelo<CuentaBancaria> = {
    campos: {
        codigoCuenta: { requerido: true },
        paisId: { requerido: true },
        descripcion: { requerido: false },
        iban: { requerido: false, validacion: ibanCuentaValido },
        bic: { requerido: false },
        entidad: { requerido: false },
        agencia: { requerido: false },
        digitoControl: { requerido: false },
        cuenta: { requerido: false },
        empresaId: { requerido: false },
        obsoleta: { requerido: false, tipo: "checkbox" },
    },
};

export const cuentaBancariaInicial = (): CuentaBancaria => ({
    id: '',
    codigoCuenta: '',
    paisId: '',
    obsoleta: false,
    empresaId: '',
    descripcion: '',
    iban: '',
    bic: '',
    entidad: '',
    agencia: '',
    digitoControl: '',
    cuenta: '',
});

export const contextoDetalleCuentaBancariaInicial: ContextoDetalleCuentaBancaria = {
    estado: 'INICIAL',
    cuenta: cuentaBancariaInicial(),
};

export const refrescarCuenta: ProcesarDetalle = async (contexto) => {
    const cuenta = await getCuentaBancaria(contexto.cuenta.id);
    return [
        { ...contexto, cuenta },
        [["cuenta_cambiada", cuenta]],
    ];
};

export const guardarCuenta = async (
    contexto: ContextoDetalleCuentaBancaria,
    cuenta: CuentaBancaria,
): Promise<void> => {
    const anterior = contexto.cuenta;
    const hayCambios =
        cuenta.codigoCuenta !== anterior.codigoCuenta ||
        cuenta.paisId !== anterior.paisId ||
        cuenta.obsoleta !== anterior.obsoleta ||
        cuenta.empresaId !== anterior.empresaId ||
        cuenta.descripcion !== anterior.descripcion ||
        cuenta.iban !== anterior.iban ||
        cuenta.bic !== anterior.bic ||
        cuenta.entidad !== anterior.entidad ||
        cuenta.agencia !== anterior.agencia ||
        cuenta.digitoControl !== anterior.digitoControl ||
        cuenta.cuenta !== anterior.cuenta;
    if (hayCambios) {
        await patchCuentaBancaria(cuenta.id, cuenta);
    }
};

export const cargarCuenta: (_: string) => ProcesarDetalle =
    (idCuenta) => async (contexto) => {
        const cuenta = await getCuentaBancaria(idCuenta);
        return pipeCuenta(contexto, [
            async (ctx) => ({ ...ctx, cuenta }),
            'ABIERTO',
        ]);
    };

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idCuenta = payload as string;
    if (idCuenta) {
        return cargarCuenta(idCuenta)(contexto);
    }
    return { ...contexto, estado: 'INICIAL', cuenta: cuentaBancariaInicial() };
};
