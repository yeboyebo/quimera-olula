import { Criteria, Entidad, RespuestaLista } from "@olula/lib/diseño.ts";

/**
 * Estado de conciliación del movimiento (no confundir con `pendiente`, que es
 * el flag del proveedor bancario para transacciones aún no confirmadas por el banco).
 * `candidatos`: sin conciliar pero con casaciones posibles para que el usuario elija.
 */
export type EstadoMovimientoBancario = "pendiente" | "candidatos" | "conciliado" | "ignorado";

export type TipoReciboMovimiento = "cobro" | "pago";

export type OrigenConciliacionMovimiento = "determinista" | "ia" | "manual";

/**
 * Forma de conciliar un movimiento. Cada tipo tiene sus `params` y su manera
 * de resolverse en el servidor (`PATCH movimiento_bancario/<id>/casar`).
 */
export type TipoCasacion =
    | "cobrar_recibo_venta"
    | "pagar_recibo_compra"
    | "cobro_parcial_venta"
    | "pago_parcial_compra"
    | "asiento_manual";

/** Recibo que liquidaría una casación de recibo. */
export interface ReciboCasacion {
    id: string;
    codigo: string;
    tercero: string | null;
    importe: number;
    fechaVencimiento: Date;
    estado: string;
}

/** Casación candidata de un movimiento, propuesta por las reglas o la IA. */
export interface Casacion extends Entidad {
    id: string;
    tipo: TipoCasacion;
    params: Record<string, unknown>;
    /** 0-100. */
    probabilidad: number;
    origen: OrigenConciliacionMovimiento;
    justificacion: string | null;
    recibo: ReciboCasacion | null;
}

export type GetCasacionesMovimientoBancario = (id: string) => Promise<Casacion[]>;

/**
 * Lo que se manda al casar: una candidata (`casacionId`, y en `params` los
 * datos que pida, p. ej. la subcuenta de un asiento) o una casación a mano
 * (`tipo` y sus `params`).
 */
export type CasarMovimiento =
    | { casacionId: string; params?: Record<string, unknown> }
    | { tipo: TipoCasacion; params: Record<string, unknown> };

export type PatchCasarMovimientoBancario = (id: string, casacion: CasarMovimiento) => Promise<void>;

/**
 * Movimiento importado de una cuenta bancaria conectada vía el proveedor
 * bancario activo (ver `tesoreria/conexion_bancaria`).
 */
export interface MovimientoBancario extends Entidad {
    id: string;
    conexionId: string;
    institucionNombre: string | null;
    cuentaConexionId: string;
    nombreCuenta: string;
    cuentaBancoId: string | null;
    descripcionCuentaBanco: string | null;
    idExterno: string;
    fecha: Date;
    fechaValor: Date | null;
    /** Con criterio contable: positivo = ingreso/cobro, negativo = cargo/pago. */
    importe: number;
    divisa: string | null;
    concepto: string;
    contraparte: string | null;
    referencia: string | null;
    /** Flag del proveedor bancario: la transacción aún puede cambiar de importe/fecha. */
    pendiente: boolean;
    estado: EstadoMovimientoBancario;
    numCasaciones: number;
    /** De la casación candidata más probable. */
    probabilidadMaxima: number | null;
    /** Casación aplicada al conciliar, con su recibo si es de recibo. */
    tipoCasacion: TipoCasacion | null;
    reciboId: string | null;
    codigoRecibo: string | null;
    nombreTercero: string | null;
    probabilidad: number | null;
    origenConciliacion: OrigenConciliacionMovimiento | null;
    justificacion: string | null;
    conciliadoPor: string | null;
    conciliadoEn: Date | null;
    /** El proveedor ya no devuelve esta transacción (removed) pero no se borra si está conciliada. */
    eliminadoEnBanco: boolean;
    requiereRevision: boolean;
}

export type GetMovimientoBancario = (id: string) => Promise<MovimientoBancario>;

export type GetMovimientosBancarios = (criteria: Criteria) => RespuestaLista<MovimientoBancario>;

export type ErrorSincronizacionMovimientoBancario = {
    conexionId: string;
    institucionNombre: string | null;
    error: string;
    requiereReautenticacion: boolean;
};

export type ResumenSincronizacionMovimientoBancario = {
    conexiones: number;
    nuevos: number;
    modificados: number;
    eliminados: number;
    /** Conciliados y con casaciones candidatas por las reglas automáticas al terminar de sincronizar. */
    conciliados: number;
    conCandidatos: number;
    /** De los anteriores, los que resolvió la IA. */
    conciliadosIa: number;
    conCandidatosIa: number;
    errores: ErrorSincronizacionMovimientoBancario[];
    erroresConciliacion: string[];
};

export type PostSincronizarMovimientoBancario = () => Promise<ResumenSincronizacionMovimientoBancario>;

export type ResumenConciliacionAutomatica = {
    analizados: number;
    conciliados: number;
    conCandidatos: number;
    consultasIa: number;
    conciliadosIa: number;
    conCandidatosIa: number;
    errores: string[];
};

export type PostConciliarAutomaticamente = () => Promise<ResumenConciliacionAutomatica>;

/**
 * Recibo que el usuario puede elegir a mano para liquidar el movimiento: por
 * su importe (casación completa) o por más (parcial). `id` es sintético (no
 * viene de la API): `${tipoRecibo}_${reciboId}`, necesario porque
 * `Listado`/`ListadoSemiControlado` requieren `Entidad`.
 */
export interface CandidatoConciliacion extends Entidad {
    id: string;
    tipoRecibo: TipoReciboMovimiento;
    tipoCasacion: TipoCasacion;
    reciboId: string;
    codigo: string;
    facturaCodigo: string | null;
    tercero: string | null;
    idFiscal: string | null;
    importe: number;
    fechaVencimiento: Date;
    estado: string;
    diasDiferencia: number;
}

export type GetCandidatosConciliacion = (id: string, texto?: string) => Promise<CandidatoConciliacion[]>;

export type PatchDesconciliarMovimientoBancario = (id: string) => Promise<void>;

export type PatchIgnorarMovimientoBancario = (id: string, motivo?: string) => Promise<void>;

export type PatchReactivarMovimientoBancario = (id: string) => Promise<void>;
