import { Criteria, Entidad, RespuestaLista } from "@olula/lib/diseño.ts";

/**
 * Estado de conciliación del movimiento (no confundir con `pendiente`, que es
 * el flag del proveedor bancario para transacciones aún no confirmadas por el banco).
 */
export type EstadoMovimientoBancario = "pendiente" | "sugerido" | "conciliado" | "ignorado";

export type TipoReciboMovimiento = "cobro" | "pago";

export type OrigenConciliacionMovimiento = "determinista" | "ia" | "manual";

/**
 * Movimiento importado de una cuenta bancaria conectada vía el proveedor
 * bancario activo (ver `tesoreria/conexion_bancaria`). Fase 2: solo lectura +
 * sincronización. La conciliación (candidatos, Conciliar/Desconciliar/Ignorar)
 * llega en la fase 3.
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
    tipoRecibo: TipoReciboMovimiento | null;
    reciboId: string | null;
    codigoRecibo: string | null;
    nombreTercero: string | null;
    puntuacion: number | null;
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
    /** Conciliados y sugeridos por las reglas automáticas al terminar de sincronizar. */
    conciliados: number;
    sugeridos: number;
    /** De los anteriores, los que resolvió la IA. */
    conciliadosIa: number;
    sugeridosIa: number;
    errores: ErrorSincronizacionMovimientoBancario[];
    erroresConciliacion: string[];
};

export type PostSincronizarMovimientoBancario = () => Promise<ResumenSincronizacionMovimientoBancario>;

export type ResumenConciliacionAutomatica = {
    analizados: number;
    conciliados: number;
    sugeridos: number;
    consultasIa: number;
    conciliadosIa: number;
    sugeridosIa: number;
    errores: string[];
};

export type PostConciliarAutomaticamente = () => Promise<ResumenConciliacionAutomatica>;

/**
 * Recibo candidato a ser liquidado por un movimiento (fase 3: conciliación
 * manual). `id` es sintético (no viene de la API): `${tipoRecibo}_${reciboId}`,
 * necesario porque `Listado`/`ListadoSemiControlado` requieren `Entidad`.
 */
export interface CandidatoConciliacion extends Entidad {
    id: string;
    tipoRecibo: TipoReciboMovimiento;
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

export type PatchConciliarMovimientoBancario = (id: string, reciboId: string) => Promise<void>;

export type PatchDesconciliarMovimientoBancario = (id: string) => Promise<void>;

export type PatchIgnorarMovimientoBancario = (id: string, motivo?: string) => Promise<void>;

export type PatchReactivarMovimientoBancario = (id: string) => Promise<void>;
