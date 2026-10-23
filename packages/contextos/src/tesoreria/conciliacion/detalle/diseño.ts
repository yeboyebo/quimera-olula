import { CandidatoConciliacion, Casacion, CuotaCasacion, MovimientoBancario, TipoCasacion } from "../diseño.js";

/**
 * CASANDO / DESCONCILIANDO / IGNORANDO / REACTIVANDO: modales de las acciones
 * (ver casar/, casar_asiento/, desconciliar/, ignorar/, reactivar/ a nivel de módulo).
 */
export type EstadoDetalleConciliacion =
    | 'INICIAL'
    | 'ABIERTO'
    | 'CASANDO'
    | 'DESCONCILIANDO'
    | 'IGNORANDO'
    | 'REACTIVANDO';

/**
 * Casación elegida, pendiente de confirmar en el modal: una candidata
 * (`casacionId`) o una a mano (un recibo de la búsqueda o un asiento).
 */
export type CasacionSeleccionada = {
    casacionId: string | null;
    tipo: TipoCasacion;
    params: Record<string, unknown>;
    probabilidad: number | null;
    justificacion: string | null;
    recibo: {
        codigo: string;
        tercero: string | null;
        importe: number;
        fechaVencimiento: Date;
    } | null;
    cuota: CuotaCasacion | null;
};

export type ContextoDetalleConciliacion = {
    estado: EstadoDetalleConciliacion;
    movimiento: MovimientoBancario;
    /** Casaciones candidatas propuestas por las reglas o la IA. */
    casaciones: Casacion[];
    /** Recibos para casar a mano; solo tiene sentido si el movimiento no está resuelto. */
    candidatos: CandidatoConciliacion[];
    candidatosTexto: string;
    casacionSeleccionada: CasacionSeleccionada | null;
};
