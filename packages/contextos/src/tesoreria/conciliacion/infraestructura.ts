import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { fechaDesdeApi } from "../comun/infraestructura.js";
import ApiUrls from "../comun/urls.js";
import {
    CandidatoConciliacion,
    Casacion,
    EstadoMovimientoBancario,
    GetCandidatosConciliacion,
    GetCasacionesMovimientoBancario,
    GetMovimientoBancario,
    GetMovimientosBancarios,
    MovimientoBancario,
    OrigenConciliacionMovimiento,
    PatchCasarMovimientoBancario,
    PatchDesconciliarMovimientoBancario,
    PatchIgnorarMovimientoBancario,
    PatchReactivarMovimientoBancario,
    PostSincronizarMovimientoBancario,
    PostConciliarAutomaticamente,
    ResumenSincronizacionMovimientoBancario,
    TipoCasacion,
    TipoReciboMovimiento,
} from "./diseño.js";

export interface MovimientoBancarioApi {
    id: string;
    conexion_id: string;
    institucion_nombre: string | null;
    cuenta_conexion_id: string;
    nombre_cuenta: string;
    cuenta_banco_id: string | null;
    descripcion_cuenta_banco: string | null;
    id_externo: string;
    fecha: string;
    fecha_valor: string | null;
    importe: number;
    divisa: string | null;
    concepto: string;
    contraparte: string | null;
    referencia: string | null;
    pendiente: boolean;
    estado: EstadoMovimientoBancario;
    num_casaciones: number;
    probabilidad_maxima: number | null;
    tipo_casacion: TipoCasacion | null;
    recibo_id: string | null;
    codigo_recibo: string | null;
    nombre_tercero: string | null;
    probabilidad: number | null;
    origen_conciliacion: OrigenConciliacionMovimiento | null;
    justificacion: string | null;
    conciliado_por: string | null;
    conciliado_en: string | null;
    eliminado_en_banco: boolean;
    requiere_revision: boolean;
}

export interface CandidatoConciliacionApi {
    tipo_recibo: TipoReciboMovimiento;
    tipo_casacion: TipoCasacion;
    recibo_id: string;
    codigo: string;
    factura_codigo: string | null;
    tercero: string | null;
    id_fiscal: string | null;
    importe: number;
    fecha_vencimiento: string;
    estado: string;
    dias_diferencia: number;
}

interface ReciboCasacionApi {
    id: string;
    codigo: string;
    tercero: string | null;
    importe: number;
    fecha_vencimiento: string;
    estado: string;
}

interface CuotaCasacionApi {
    contrato: string | null;
    fecha: string;
    capital: number;
    intereses: number;
    total: number;
}

export interface CasacionApi {
    id: string;
    tipo: TipoCasacion;
    params: Record<string, unknown>;
    probabilidad: number;
    origen: OrigenConciliacionMovimiento;
    justificacion: string | null;
    recibo: ReciboCasacionApi | null;
    cuota?: CuotaCasacionApi | null;
}

interface CasarMovimientoBancarioApi {
    casacion_id?: string;
    tipo_casacion?: TipoCasacion;
    params?: Record<string, unknown>;
}

interface IgnorarMovimientoBancarioApi {
    motivo?: string;
}

interface ErrorSincronizacionMovimientoBancarioApi {
    conexion_id: string;
    institucion_nombre: string | null;
    error: string;
    requiere_reautenticacion: boolean;
}

interface ResumenSincronizacionMovimientoBancarioApi {
    conexiones: number;
    nuevos: number;
    modificados: number;
    eliminados: number;
    conciliados: number;
    con_candidatos: number;
    conciliados_ia: number;
    con_candidatos_ia: number;
    errores: ErrorSincronizacionMovimientoBancarioApi[];
    errores_conciliacion: string[];
}

interface ResumenConciliacionAutomaticaApi {
    analizados: number;
    conciliados: number;
    con_candidatos: number;
    consultas_ia: number;
    conciliados_ia: number;
    con_candidatos_ia: number;
    errores: string[];
}

const baseUrl = new ApiUrls().MOVIMIENTO_BANCARIO;

/**
 * Mapea la respuesta de API a la interfaz del dominio.
 * `fecha` siempre viene informada (YYYY-MM-DD); el resto de fechas son nullable.
 */
export const movimientoBancarioDesdeApi = (api: MovimientoBancarioApi): MovimientoBancario => ({
    id: api.id,
    conexionId: api.conexion_id,
    institucionNombre: api.institucion_nombre,
    cuentaConexionId: api.cuenta_conexion_id,
    nombreCuenta: api.nombre_cuenta,
    cuentaBancoId: api.cuenta_banco_id,
    descripcionCuentaBanco: api.descripcion_cuenta_banco,
    idExterno: api.id_externo,
    fecha: new Date(Date.parse(api.fecha)),
    fechaValor: fechaDesdeApi(api.fecha_valor),
    importe: api.importe,
    divisa: api.divisa,
    concepto: api.concepto,
    contraparte: api.contraparte,
    referencia: api.referencia,
    pendiente: api.pendiente,
    estado: api.estado,
    numCasaciones: api.num_casaciones ?? 0,
    probabilidadMaxima: api.probabilidad_maxima,
    tipoCasacion: api.tipo_casacion,
    reciboId: api.recibo_id,
    codigoRecibo: api.codigo_recibo,
    nombreTercero: api.nombre_tercero,
    probabilidad: api.probabilidad,
    origenConciliacion: api.origen_conciliacion,
    justificacion: api.justificacion,
    conciliadoPor: api.conciliado_por,
    conciliadoEn: fechaDesdeApi(api.conciliado_en),
    eliminadoEnBanco: api.eliminado_en_banco,
    requiereRevision: api.requiere_revision,
});

export const candidatoConciliacionDesdeApi = (api: CandidatoConciliacionApi): CandidatoConciliacion => ({
    id: `${api.tipo_recibo}_${api.recibo_id}`,
    tipoRecibo: api.tipo_recibo,
    tipoCasacion: api.tipo_casacion,
    reciboId: api.recibo_id,
    codigo: api.codigo,
    facturaCodigo: api.factura_codigo,
    tercero: api.tercero,
    idFiscal: api.id_fiscal,
    importe: api.importe,
    fechaVencimiento: new Date(Date.parse(api.fecha_vencimiento)),
    estado: api.estado,
    diasDiferencia: api.dias_diferencia,
});

export const casacionDesdeApi = (api: CasacionApi): Casacion => ({
    id: api.id,
    tipo: api.tipo,
    params: api.params ?? {},
    probabilidad: api.probabilidad,
    origen: api.origen,
    justificacion: api.justificacion,
    recibo: api.recibo
        ? {
            id: api.recibo.id,
            codigo: api.recibo.codigo,
            tercero: api.recibo.tercero,
            importe: api.recibo.importe,
            fechaVencimiento: new Date(Date.parse(api.recibo.fecha_vencimiento)),
            estado: api.recibo.estado,
        }
        : null,
    cuota: api.cuota
        ? {
            contrato: api.cuota.contrato,
            fecha: new Date(Date.parse(api.cuota.fecha)),
            capital: api.cuota.capital,
            intereses: api.cuota.intereses,
            total: api.cuota.total,
        }
        : null,
});

const resumenSincronizacionDesdeApi = (
    api: ResumenSincronizacionMovimientoBancarioApi
): ResumenSincronizacionMovimientoBancario => ({
    conexiones: api.conexiones,
    nuevos: api.nuevos,
    modificados: api.modificados,
    eliminados: api.eliminados,
    conciliados: api.conciliados ?? 0,
    conCandidatos: api.con_candidatos ?? 0,
    conciliadosIa: api.conciliados_ia ?? 0,
    conCandidatosIa: api.con_candidatos_ia ?? 0,
    erroresConciliacion: api.errores_conciliacion ?? [],
    errores: (api.errores ?? []).map((error) => ({
        conexionId: error.conexion_id,
        institucionNombre: error.institucion_nombre,
        error: error.error,
        requiereReautenticacion: error.requiere_reautenticacion,
    })),
});

export const getMovimientoBancario: GetMovimientoBancario = async (id) => {
    return await RestAPI.getItem<MovimientoBancario, MovimientoBancarioApi>(
        `${baseUrl}/${id}`,
        movimientoBancarioDesdeApi,
        "Error al obtener el movimiento bancario"
    );
};

export const getMovimientosBancarios: GetMovimientosBancarios = async (criteria) => {
    return await RestAPI.getQuery<MovimientoBancario, MovimientoBancarioApi>(
        baseUrl,
        criteria,
        movimientoBancarioDesdeApi,
        "Error al obtener los movimientos bancarios"
    );
};

/**
 * Lanza `/transactions/sync` para todas las conexiones activas. Sin cuerpo;
 * puede tardar varios segundos. Devuelve un resumen aunque alguna conexión
 * individual haya fallado (ver `errores`).
 */
export const postSincronizarMovimientoBancario: PostSincronizarMovimientoBancario = async () => {
    const respuesta = await RestAPI.query<undefined, ResumenSincronizacionMovimientoBancarioApi>(
        `${baseUrl}/sincronizar`,
        undefined,
        "Error al sincronizar los movimientos bancarios"
    );
    return resumenSincronizacionDesdeApi(respuesta);
};

/** Aplica las reglas automáticas a todos los movimientos conciliables (lo mismo que al sincronizar). */
export const postConciliarAutomaticamente: PostConciliarAutomaticamente = async () => {
    const api = await RestAPI.query<undefined, ResumenConciliacionAutomaticaApi>(
        `${baseUrl}/conciliar_automaticamente`,
        undefined,
        "Error al conciliar automáticamente los movimientos bancarios"
    );
    return {
        analizados: api.analizados,
        conciliados: api.conciliados,
        conCandidatos: api.con_candidatos ?? 0,
        consultasIa: api.consultas_ia ?? 0,
        conciliadosIa: api.conciliados_ia ?? 0,
        conCandidatosIa: api.con_candidatos_ia ?? 0,
        errores: api.errores ?? [],
    };
};

/**
 * Recibos que el usuario puede elegir a mano: por el importe del movimiento o
 * por más (parcial). `texto` filtra por código de recibo/factura, tercero o
 * NIF; se manda tal cual en la query.
 */
export const getCandidatosConciliacion: GetCandidatosConciliacion = async (id, texto) => {
    const query = texto ? `?texto=${encodeURIComponent(texto)}` : "";
    return await RestAPI.getLista<CandidatoConciliacion, CandidatoConciliacionApi>(
        `${baseUrl}/${id}/candidatos${query}`,
        candidatoConciliacionDesdeApi,
        "Error al obtener los candidatos de conciliación"
    );
};

/** Casaciones candidatas del movimiento, de más a menos probable. */
export const getCasacionesMovimientoBancario: GetCasacionesMovimientoBancario = async (id) => {
    return await RestAPI.getLista<Casacion, CasacionApi>(
        `${baseUrl}/${id}/casaciones`,
        casacionDesdeApi,
        "Error al obtener las casaciones del movimiento"
    );
};

/**
 * Resuelve la casación en el servidor (paga el recibo, lo divide, genera el
 * asiento...) con la fecha del movimiento y lo deja conciliado.
 */
export const patchCasarMovimientoBancario: PatchCasarMovimientoBancario = async (id, casacion) => {
    const cuerpo: CasarMovimientoBancarioApi = "casacionId" in casacion
        ? { casacion_id: casacion.casacionId, params: casacion.params ?? {} }
        : { tipo_casacion: casacion.tipo, params: casacion.params };
    await RestAPI.patch<CasarMovimientoBancarioApi>(
        `${baseUrl}/${id}/casar`,
        cuerpo,
        "Error al conciliar el movimiento"
    );
};

/** Deshace la casación y deja el movimiento pendiente (puede llegar a borrarlo, ver detalle.ts). */
export const patchDesconciliarMovimientoBancario: PatchDesconciliarMovimientoBancario = async (id) => {
    await RestAPI.patch(`${baseUrl}/${id}/desconciliar`, {}, "Error al desconciliar el movimiento");
};

export const patchIgnorarMovimientoBancario: PatchIgnorarMovimientoBancario = async (id, motivo) => {
    await RestAPI.patch<IgnorarMovimientoBancarioApi>(
        `${baseUrl}/${id}/ignorar`,
        motivo ? { motivo } : {},
        "Error al ignorar el movimiento"
    );
};

export const patchReactivarMovimientoBancario: PatchReactivarMovimientoBancario = async (id) => {
    await RestAPI.patch(`${baseUrl}/${id}/reactivar`, {}, "Error al reactivar el movimiento");
};
