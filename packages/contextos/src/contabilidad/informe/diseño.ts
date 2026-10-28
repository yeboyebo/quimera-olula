import { Criteria, Entidad } from "@olula/lib/diseño.ts";

export interface CabeceraMayor {
    subcuentaId: number;
    codigoSubcuenta: string;
    descripcionSubcuenta: string;
    saldoInicial: number;
    saldoFinal: number;
}

export interface LineaMayor extends Entidad {
    id: string;
    partidaId: number;
    asientoId: number;
    asientoNumero: number;
    fecha: Date;
    concepto: string;
    debe: number;
    haber: number;
    saldo: number;
}

export interface InformeMayor {
    cabecera: CabeceraMayor;
    lineas: LineaMayor[];
    total: number;
}

export interface LineaDiario extends Entidad {
    id: string;
    partidaId: number;
    asientoId: number;
    asientoNumero: number;
    fecha: Date;
    conceptoAsiento: string;
    codigoSubcuenta: string;
    concepto: string;
    debe: number;
    haber: number;
}

export interface FilaLibroFacturasIva extends Entidad {
    id: string;
    partidaId: number;
    fechaAsiento: Date;
    asientoNumero: number;
    codigoSerie: string | null;
    numeroFactura: string | null;
    codigoFactura: string | null;
    nombreTercero: string | null;
    codigoTercero: string | null;
    cifNif: string | null;
    codigoContrapartida: string | null;
    nombreContrapartida: string | null;
    baseImponible: number;
    cuotaIva: number;
    porcentajeIva: number;
    porcentajeRecargo: number;
    codImpuesto: string | null;
    codGrupoIvaNeg: string | null;
    tipoCalculo: string | null;
    documento: string | null;
}

export type TipoInformeContableReport =
    | "mayor"
    | "diario"
    | "libro_facturas_emitidas"
    | "libro_facturas_recibidas";

export type GetInformeMayor = (criteria: Criteria) => Promise<InformeMayor>;
export type GetInformeLibroFacturasIva = (
    criteria: Criteria
) => Promise<{ datos: FilaLibroFacturasIva[]; total: number }>;
export type GetInformeDiario = (criteria: Criteria) => Promise<{ datos: LineaDiario[]; total: number }>;
export type GetReportInformeContable = (
    tipo: TipoInformeContableReport,
    criteria: Criteria
) => Promise<Blob>;
