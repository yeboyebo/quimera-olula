import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Criteria } from "@olula/lib/diseño.ts";
import { criteriaAQueryString } from "@olula/lib/infraestructura.ts";
import ApiUrls from "#/contabilidad/comun/urls.ts";
import {
    CabeceraMayor,
    FilaLibroFacturasIva,
    GetInformeDiario,
    GetInformeLibroFacturasIva,
    GetInformeMayor,
    GetReportInformeContable,
    InformeMayor,
    LineaDiario,
    LineaMayor,
    TipoInformeContableReport,
} from "./diseño.ts";

const urls = new ApiUrls();

interface CabeceraMayorApi {
    subcuenta_id: number;
    codigo_subcuenta: string;
    descripcion_subcuenta: string;
    saldo_inicial: number;
    saldo_final: number;
}

interface LineaMayorApi {
    partida_id: number;
    asiento_id: number;
    asiento_numero: number;
    fecha: string;
    concepto: string;
    debe: number;
    haber: number;
    saldo: number;
}

interface InformeMayorDatosApi {
    cabecera: CabeceraMayorApi;
    lineas: LineaMayorApi[];
    total: number;
}

interface LineaDiarioApi {
    partida_id: number;
    asiento_id: number;
    asiento_numero: number;
    fecha: string;
    concepto_asiento: string;
    codigo_subcuenta: string;
    concepto: string;
    debe: number;
    haber: number;
}

const fechaDesdeApi = (fecha: string): Date => new Date(`${fecha}T12:00:00`);

export const cabeceraMayorDesdeApi = (api: CabeceraMayorApi): CabeceraMayor => ({
    subcuentaId: api.subcuenta_id,
    codigoSubcuenta: api.codigo_subcuenta,
    descripcionSubcuenta: api.descripcion_subcuenta,
    saldoInicial: api.saldo_inicial,
    saldoFinal: api.saldo_final,
});

export const lineaMayorDesdeApi = (api: LineaMayorApi): LineaMayor => ({
    id: String(api.partida_id),
    partidaId: api.partida_id,
    asientoId: api.asiento_id,
    asientoNumero: api.asiento_numero,
    fecha: fechaDesdeApi(api.fecha),
    concepto: api.concepto ?? "",
    debe: api.debe,
    haber: api.haber,
    saldo: api.saldo,
});

export const informeMayorDesdeApi = (api: InformeMayorDatosApi): InformeMayor => ({
    cabecera: cabeceraMayorDesdeApi(api.cabecera),
    lineas: api.lineas.map(lineaMayorDesdeApi),
    total: api.total,
});

export const lineaDiarioDesdeApi = (api: LineaDiarioApi): LineaDiario => ({
    id: String(api.partida_id),
    partidaId: api.partida_id,
    asientoId: api.asiento_id,
    asientoNumero: api.asiento_numero,
    fecha: fechaDesdeApi(api.fecha),
    conceptoAsiento: api.concepto_asiento ?? "",
    codigoSubcuenta: api.codigo_subcuenta,
    concepto: api.concepto ?? "",
    debe: api.debe,
    haber: api.haber,
});

interface FilaLibroFacturasIvaApi {
    partida_id: number;
    fecha_asiento: string;
    asiento_numero: number;
    codigo_serie: string | null;
    numero_factura: string | null;
    codigo_factura: string | null;
    nombre_tercero: string | null;
    codigo_tercero: string | null;
    cif_nif: string | null;
    codigo_contrapartida: string | null;
    nombre_contrapartida: string | null;
    base_imponible: number;
    cuota_iva: number;
    porcentaje_iva: number;
    porcentaje_recargo: number;
    cod_impuesto: string | null;
    cod_grupo_iva_neg: string | null;
    tipo_calculo: string | null;
    documento: string | null;
}

export const filaLibroFacturasIvaDesdeApi = (api: FilaLibroFacturasIvaApi): FilaLibroFacturasIva => ({
    id: String(api.partida_id),
    partidaId: api.partida_id,
    fechaAsiento: fechaDesdeApi(api.fecha_asiento),
    asientoNumero: api.asiento_numero,
    codigoSerie: api.codigo_serie,
    numeroFactura: api.numero_factura,
    codigoFactura: api.codigo_factura,
    nombreTercero: api.nombre_tercero,
    codigoTercero: api.codigo_tercero,
    cifNif: api.cif_nif,
    codigoContrapartida: api.codigo_contrapartida,
    nombreContrapartida: api.nombre_contrapartida,
    baseImponible: api.base_imponible,
    cuotaIva: api.cuota_iva,
    porcentajeIva: api.porcentaje_iva,
    porcentajeRecargo: api.porcentaje_recargo,
    codImpuesto: api.cod_impuesto,
    codGrupoIvaNeg: api.cod_grupo_iva_neg,
    tipoCalculo: api.tipo_calculo,
    documento: api.documento,
});

export const urlReportInforme = (tipo: TipoInformeContableReport, criteria: Criteria): string => {
    const q = criteriaAQueryString(criteria);
    return `${urls.INFORME_REPORT(tipo)}${q}`;
};

export const getInformeMayor: GetInformeMayor = async (criteria) =>
    RestAPI.getItem(
        `${urls.INFORME_MAYOR}${criteriaAQueryString(criteria)}`,
        informeMayorDesdeApi,
        "Error al cargar el libro mayor"
    );

export const getInformeDiario: GetInformeDiario = async (criteria) =>
    RestAPI.getQuery(urls.INFORME_DIARIO, criteria, lineaDiarioDesdeApi, "Error al cargar el libro diario");

export const getReportInformeContable: GetReportInformeContable = async (tipo, criteria) =>
    RestAPI.blob(urlReportInforme(tipo, criteria), `Error al descargar PDF (${tipo})`);

export const getInformeLibroFacturasEmitidas: GetInformeLibroFacturasIva = async (criteria) =>
    RestAPI.getQuery(
        urls.INFORME_LIBRO_FACTURAS_EMITIDAS,
        criteria,
        filaLibroFacturasIvaDesdeApi,
        "Error al cargar el informe de facturas emitidas"
    );

export const getInformeLibroFacturasRecibidas: GetInformeLibroFacturasIva = async (criteria) =>
    RestAPI.getQuery(
        urls.INFORME_LIBRO_FACTURAS_RECIBIDAS,
        criteria,
        filaLibroFacturasIvaDesdeApi,
        "Error al cargar el informe de facturas recibidas"
    );
