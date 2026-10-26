import { Criteria, Entidad, RespuestaLista } from "@olula/lib/diseño.ts";

/**
 * Estado de conciliación del movimiento (no confundir con `pendiente`, que es
 * el flag del proveedor bancario para transacciones aún no confirmadas por el banco).
 * `candidatos`: sin conciliar pero con conciliaciones posibles para que el usuario elija.
 */
export type EstadoMovimientoBancario = "pendiente" | "candidatos" | "conciliado" | "ignorado";

export type TipoReciboMovimiento = "cobro" | "pago";

export type OrigenConciliacionMovimiento = "determinista" | "ia" | "manual";

/**
 * Forma de conciliar un movimiento. Cada tipo tiene sus `params` y su manera
 * de resolverse en el servidor (`PATCH movimiento_bancario/<id>/conciliar`).
 */
export type TipoConciliacion =
    | "cobrar_recibo_venta"
    | "pagar_recibo_compra"
    | "cobro_parcial_venta"
    | "pago_parcial_compra"
    | "asiento_manual"
    | "asiento_vinculado"
    | "cuota_prestamo";

/** Recibo que liquidaría una casación de recibo. */
export interface ReciboConciliacion {
    id: string;
    codigo: string;
    tercero: string | null;
    importe: number;
    fechaVencimiento: Date;
    estado: string;
    fechaEmision: Date | null;
    fechaCobro: Date | null;
}

/** Cuota de préstamo que contabilizaría una casación `cuota_prestamo`. */
export interface CuotaConciliacion {
    contrato: string | null;
    fecha: Date;
    capital: number;
    intereses: number;
    total: number;
}

/**
 * Un movimiento ERP individual dentro de una casación: tipo, params y los
 * datos de presentación del objeto ERP asociado (recibo o cuota).
 */
export interface ItemConciliacion {
    tipo: TipoConciliacion;
    params: Record<string, unknown>;
    /** Recibo que liquida este ítem (solo en recibos de venta/compra). */
    recibo: ReciboConciliacion | null;
    /** Cuota de préstamo (solo si tipo === 'cuota_prestamo'). */
    cuota: CuotaConciliacion | null;
}

/** Conciliación candidata de un movimiento, propuesta por las reglas o la IA. */
export interface Conciliacion extends Entidad {
    id: string;
    /** Lista de movimientos ERP que se resolverían al conciliar (1:M). */
    items: ItemConciliacion[];
    /** 0-100. */
    probabilidad: number;
    origen: OrigenConciliacionMovimiento;
    justificacion: string | null;
}

export type GetConciliacionesMovimientoBancario = (id: string) => Promise<Conciliacion[]>;

/**
 * Lo que se manda al conciliar: una candidata (`conciliacionId`, opcionalmente con
 * `extraParams`) o una conciliación manual (`items` con tipo y params de cada ítem).
 */
export type ConciliarMovimiento =
    | { conciliacionId: string; extraParams?: Record<string, unknown> }
    | { items: ItemConciliacion[] };

export type PatchConciliarMovimientoBancario = (id: string, conciliacion: ConciliarMovimiento) => Promise<void>;

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
    numConciliaciones: number;
    /** De la conciliación candidata más probable. */
    probabilidadMaxima: number | null;
    /** Número de ítems ERP de la conciliación aplicada (0 si no está conciliado). */
    numItemsConciliacion: number;
    probabilidad: number | null;
    origenConciliacion: OrigenConciliacionMovimiento | null;
    justificacion: string | null;
    conciliadoPor: string | null;
    conciliadoEn: Date | null;
    /** El proveedor ya no devuelve esta transacción (removed) pero no se borra si está conciliada. */
    eliminadoEnBanco: boolean;
    requiereRevision: boolean;
    /** Código de subcuenta contable de la cuenta bancaria (cuentasbanco.codsubcuenta), o null si no enlazada. */
    subcuentaBancoId: string | null;
    /** Saldo de la cuenta bancaria tras este movimiento, anclado al saldo_actual reportado por el banco. */
    saldo: number | null;
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
    /** Conciliados y con conciliaciones candidatas por las reglas automáticas al terminar de sincronizar. */
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
    tipoConciliacion: TipoConciliacion;
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

/** Resumen de cuadre bancario-contable de una cuenta bancaria conectada. */
export interface CuadreCuenta {
    cuentaBancoId: string;
    nombreCuenta: string;
    institucion: string | null;
    /** Saldo reportado por el banco (wealthreader). */
    saldoBanco: number | null;
    /** Saldo acumulado en co_partidas para la subcuenta contable. */
    saldoContable: number | null;
    /** saldoBanco - saldoContable. */
    diferencia: number | null;
    bancarioSinConciliar: number;
    importeSinConciliar: number;
    bancarioIgnorado: number;
    importeIgnorado: number;
    requiereRevision: number;
    bancoEliminoConciliado: number;
    asientoSubcuentaErronea: number;
    /** Partidas contables en la subcuenta bancaria sin movimiento bancario conciliado equivalente (heurística: misma fecha e importe). */
    partidaHuerfana: number;
    totalAlertas: number;
}

export interface CuadreBancario {
    cuentas: CuadreCuenta[];
}

export type GetCuadreBancario = () => Promise<CuadreBancario>;

/** Partida contable en la subcuenta bancaria sin movimiento bancario conciliado equivalente. */
export interface PartidaHuerfana {
    idasiento: number;
    fecha: Date;
    importe: number;
    descripcion: string | null;
    numeroAsiento: string | null;
}

export type GetPartidasHuerfanas = (cuentaConexionId: string) => Promise<PartidaHuerfana[]>;
