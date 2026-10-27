import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import {
    MovimientoBancario,
    ResumenConciliacionAutomatica,
    ResumenSincronizacionMovimientoBancario,
} from "../diseño.js";

/**
 * SINCRONIZANDO: mientras dura la llamada a `/movimiento_bancario/sincronizar`
 * (ver maestro/SincronizarMovimientoBancario.tsx, componente sin UI propia que
 * lanza la petición al montarse, igual que ConectarBancoConexionBancaria.tsx).
 */
export type EstadoMaestroConciliacion = 'INICIAL' | 'SINCRONIZANDO' | 'CONCILIANDO_AUTOMATICAMENTE';

export type ContextoMaestroConciliacion = {
    estado: EstadoMaestroConciliacion;
    movimientos: ListaActivaEntidades<MovimientoBancario>;
    /**
     * Cuenta bancaria de la empresa (`cuentasbanco.codcuenta`) cuando se entra
     * por `/tesoreria/cuentas/<cuenta_id>/movimientos`: la lista se limita
     * siempre a sus movimientos, sea cual sea el filtro del usuario.
     */
    cuentaBancoId: string | null;
    /** Resumen a mostrar tras sincronizar (ver ResumenSincronizacionMovimientoBancario.tsx). */
    resumenSincronizacion: ResumenSincronizacionMovimientoBancario | null;
    /** Resumen a mostrar tras "Conciliar automáticamente" (ver ResumenConciliacionAutomatica.tsx). */
    resumenConciliacionAutomatica: ResumenConciliacionAutomatica | null;
};
