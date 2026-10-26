import { MetaModelo } from "@olula/lib/dominio.js";
import { DatosAsientoMovimiento } from "./diseño.js";

export const datosAsientoVacios = (concepto: string): DatosAsientoMovimiento => ({
    codigoSubcuenta: "",
    concepto,
});

export const metaDatosAsientoMovimiento: MetaModelo<DatosAsientoMovimiento> = {
    campos: {
        codigoSubcuenta: { requerido: true },
        concepto: { requerido: true },
    },
};

/** Los datos del asiento como `params` de la casación (API en snake_case). */
export const paramsAsiento = (datos: DatosAsientoMovimiento): Record<string, unknown> => ({
    codigo_subcuenta: datos.codigoSubcuenta.trim(),
    concepto: datos.concepto.trim(),
});
