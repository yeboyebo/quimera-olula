import { CandidatoConciliacion, MovimientoBancario } from "../diseño.js";

/**
 * CONCILIANDO / DESCONCILIANDO / IGNORANDO / REACTIVANDO: modales de la fase 3
 * (ver conciliar/, desconciliar/, ignorar/, reactivar/ a nivel de módulo).
 */
export type EstadoDetalleConciliacion =
    | 'INICIAL'
    | 'ABIERTO'
    | 'CONCILIANDO'
    | 'DESCONCILIANDO'
    | 'IGNORANDO'
    | 'REACTIVANDO';

export type ContextoDetalleConciliacion = {
    estado: EstadoDetalleConciliacion;
    movimiento: MovimientoBancario;
    /** Sugerencias de recibo a liquidar; solo tiene sentido si el movimiento está pendiente/sugerido. */
    candidatos: CandidatoConciliacion[];
    candidatosTexto: string;
    /** Candidato elegido en la lista, pendiente de confirmar en el modal Conciliar. */
    candidatoSeleccionado: CandidatoConciliacion | null;
};
