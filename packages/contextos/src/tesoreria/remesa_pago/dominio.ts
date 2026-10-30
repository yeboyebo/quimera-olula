import { RemesaPago } from "./diseño.ts";

export const esRemesaDeNominas = (remesa: RemesaPago): boolean =>
    remesa.tipo === "Nóminas";

export const remesaPagoConPago = (remesa: RemesaPago): boolean =>
    remesa.pagos.length > 0;

/** El pago es siempre total: una remesa se paga una vez, entera. */
export const remesaPagoPagable = (remesa: RemesaPago): boolean =>
    !!remesa.id && !remesaPagoConPago(remesa);

export type VarianteEstadoRemesaPago = "neutro" | "exito";

const VARIANTES_ESTADO_REMESA_PAGO: Record<string, VarianteEstadoRemesaPago> = {
    emitida: "neutro",
    pagada: "exito",
};

export const varianteEstadoRemesaPago = (estado: string): VarianteEstadoRemesaPago =>
    VARIANTES_ESTADO_REMESA_PAGO[estado.trim().toLowerCase()] ?? "neutro";

/** Fecha local en formato ISO (AAAA-MM-DD), sin pasar por UTC. */
export const fechaIso = (fecha: Date): string =>
    [
        fecha.getFullYear(),
        String(fecha.getMonth() + 1).padStart(2, "0"),
        String(fecha.getDate()).padStart(2, "0"),
    ].join("-");
