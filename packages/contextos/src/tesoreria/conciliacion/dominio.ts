import { ClausulaFiltro } from "@olula/lib/diseño.ts";
import {
    CandidatoConciliacion,
    Casacion,
    EstadoMovimientoBancario,
    MovimientoBancario,
    OrigenConciliacionMovimiento,
    TipoCasacion,
    TipoReciboMovimiento,
} from "./diseño.ts";

export const movimientoBancarioVacio: MovimientoBancario = {
    id: "",
    conexionId: "",
    institucionNombre: null,
    cuentaConexionId: "",
    nombreCuenta: "",
    cuentaBancoId: null,
    descripcionCuentaBanco: null,
    idExterno: "",
    fecha: new Date(0),
    fechaValor: null,
    importe: 0,
    divisa: null,
    concepto: "",
    contraparte: null,
    referencia: null,
    pendiente: false,
    estado: "pendiente",
    numCasaciones: 0,
    probabilidadMaxima: null,
    tipoCasacion: null,
    reciboId: null,
    codigoRecibo: null,
    nombreTercero: null,
    probabilidad: null,
    origenConciliacion: null,
    justificacion: null,
    conciliadoPor: null,
    conciliadoEn: null,
    eliminadoEnBanco: false,
    requiereRevision: false,
};

export const ESTADOS_MOVIMIENTO_BANCARIO: EstadoMovimientoBancario[] = [
    "pendiente",
    "candidatos",
    "conciliado",
    "ignorado",
];

/** Vista por defecto del maestro: se ocultan los ya resueltos (conciliados/ignorados). */
export const ESTADOS_MOVIMIENTO_BANCARIO_DEFECTO: EstadoMovimientoBancario[] = [
    "pendiente",
    "candidatos",
];

export const ETIQUETA_ESTADO_MOVIMIENTO_BANCARIO: Record<EstadoMovimientoBancario, string> = {
    pendiente: "Pendiente",
    candidatos: "Candidatos",
    conciliado: "Casado",
    ignorado: "Ignorado",
};

type VarianteEtiqueta = "exito" | "error" | "advertencia" | "primario" | "gris";

/** Casado en verde, con candidatos en naranja y pendiente en rojo. */
export const VARIANTE_ESTADO_MOVIMIENTO_BANCARIO: Record<EstadoMovimientoBancario, VarianteEtiqueta> = {
    pendiente: "error",
    candidatos: "advertencia",
    conciliado: "exito",
    ignorado: "gris",
};

export const etiquetaEstadoMovimientoBancario = (estado: EstadoMovimientoBancario): string =>
    ETIQUETA_ESTADO_MOVIMIENTO_BANCARIO[estado];

/** Etiqueta de la lista: con candidatos, cuántos hay. */
export const etiquetaEstadoConCasaciones = (movimiento: MovimientoBancario): string =>
    movimiento.estado === "candidatos" && movimiento.numCasaciones > 0
        ? `${movimiento.numCasaciones} candidato${movimiento.numCasaciones === 1 ? "" : "s"}`
        : etiquetaEstadoMovimientoBancario(movimiento.estado);

export const varianteEstadoMovimientoBancario = (estado: EstadoMovimientoBancario): VarianteEtiqueta =>
    VARIANTE_ESTADO_MOVIMIENTO_BANCARIO[estado];

export const opcionesEstadoMovimientoBancario = ESTADOS_MOVIMIENTO_BANCARIO.map((estado) => ({
    valor: estado,
    descripcion: etiquetaEstadoMovimientoBancario(estado),
}));

const comoLista = (valor: unknown): string[] =>
    Array.isArray(valor)
        ? valor.map(String).filter(Boolean)
        : typeof valor === "string"
            ? valor.split(",").map((v) => v.trim()).filter(Boolean)
            : [];

export const filtroEstadoMovimientoBancario = (valor: unknown): ClausulaFiltro | null => {
    const estados = comoLista(valor);
    if (!estados.length) return null;

    return ["estado", "in", estados as unknown as string] as ClausulaFiltro;
};

export const estadosMovimientoBancarioDesdeFiltro = (filtro: ClausulaFiltro[]): string[] => {
    const clausula = filtro.find(([campo, operador]) => campo === "estado" && operador === "in");

    return clausula ? comoLista(clausula[2]) : [];
};

/** Movimientos de una cuenta bancaria de la empresa (`/tesoreria/cuentas/<cuenta_id>/movimientos`). */
export const filtroCuentaBanco = (cuentaBancoId: string): ClausulaFiltro =>
    ["cuenta_banco_id", "=", cuentaBancoId] as ClausulaFiltro;

/** Nombre de la cuenta a mostrar: el del banco, o el de la cuenta bancaria de la empresa si se asoció. */
export const cuentaMovimientoBancario = (movimiento: MovimientoBancario): string =>
    movimiento.nombreCuenta || movimiento.descripcionCuentaBanco || "Cuenta sin identificar";

export const reciboAsociadoMovimientoBancario = (movimiento: MovimientoBancario): string => {
    if (!movimiento.codigoRecibo) return "—";

    return movimiento.nombreTercero
        ? `${movimiento.codigoRecibo} · ${movimiento.nombreTercero}`
        : movimiento.codigoRecibo;
};

const RUTA_RECIBO: Record<TipoReciboMovimiento, string> = {
    cobro: "/tesoreria/recibo_venta",
    pago: "/tesoreria/recibo_compra",
};

/** Clase de recibo que liquida cada tipo de casación (los de asiento, ninguno). */
const TIPO_RECIBO_CASACION: Partial<Record<TipoCasacion, TipoReciboMovimiento>> = {
    cobrar_recibo_venta: "cobro",
    cobro_parcial_venta: "cobro",
    pagar_recibo_compra: "pago",
    pago_parcial_compra: "pago",
};

export const tipoReciboCasacion = (tipo: TipoCasacion | null): TipoReciboMovimiento | null =>
    (tipo && TIPO_RECIBO_CASACION[tipo]) ?? null;

const ETIQUETA_TIPO_CASACION: Record<TipoCasacion, string> = {
    cobrar_recibo_venta: "Cobrar recibo",
    pagar_recibo_compra: "Pagar recibo",
    cobro_parcial_venta: "Cobro parcial",
    pago_parcial_compra: "Pago parcial",
    asiento_manual: "Asiento manual",
    cuota_prestamo: "Cuota de préstamo",
};

export const etiquetaTipoCasacion = (tipo: TipoCasacion): string => ETIQUETA_TIPO_CASACION[tipo];

export const esCasacionParcial = (tipo: TipoCasacion): boolean =>
    tipo === "cobro_parcial_venta" || tipo === "pago_parcial_compra";

/** Tipos de casación que piden datos al usuario antes de casar. */
export const pideDatosCasacion = (tipo: TipoCasacion): boolean => tipo === "asiento_manual";

/** Probabilidad a partir de la cual el servidor concilia sin preguntar. */
export const PROBABILIDAD_CASAR_AUTOMATICAMENTE = 95;

export const varianteProbabilidad = (probabilidad: number): VarianteEtiqueta =>
    probabilidad >= PROBABILIDAD_CASAR_AUTOMATICAMENTE
        ? "exito"
        : probabilidad >= 60 ? "advertencia" : "gris";

/** Enlace a la ficha del recibo (de venta si es un cobro, de compra si es un pago). */
export const urlRecibo = (tipoRecibo: TipoReciboMovimiento, reciboId: string): string =>
    `${RUTA_RECIBO[tipoRecibo]}?id=${encodeURIComponent(reciboId)}`;

export const urlReciboMovimientoBancario = (movimiento: MovimientoBancario): string | null => {
    const tipoRecibo = tipoReciboCasacion(movimiento.tipoCasacion);
    return tipoRecibo && movimiento.reciboId ? urlRecibo(tipoRecibo, movimiento.reciboId) : null;
};

export const urlReciboCasacion = (casacion: Casacion): string | null => {
    const tipoRecibo = tipoReciboCasacion(casacion.tipo);
    return tipoRecibo && casacion.recibo ? urlRecibo(tipoRecibo, casacion.recibo.id) : null;
};

/** Casación a mano con un recibo elegido en la búsqueda: completa por su importe, parcial si es mayor. */
export const casacionDesdeCandidato = (
    movimiento: MovimientoBancario,
    candidato: CandidatoConciliacion
): { tipo: TipoCasacion; params: Record<string, unknown> } =>
    esCasacionParcial(candidato.tipoCasacion)
        ? {
            tipo: candidato.tipoCasacion,
            params: { recibo_id: Number(candidato.reciboId), importe: Math.abs(movimiento.importe).toFixed(2) },
        }
        : { tipo: candidato.tipoCasacion, params: { recibo_id: Number(candidato.reciboId) } };

/** Lo que quedaría pendiente en el recibo nuevo tras un cobro o pago parcial. */
export const restoCasacionParcial = (movimiento: MovimientoBancario, importeRecibo: number): number =>
    Math.round((importeRecibo - Math.abs(movimiento.importe)) * 100) / 100;

export const esIngresoMovimientoBancario = (movimiento: MovimientoBancario): boolean =>
    movimiento.importe >= 0;

export type BloqueoConciliarMovimiento = {
    bloqueado: boolean;
    motivo: string | null;
};

/**
 * Motivos por los que la UI debe impedir casar antes de llamar a la API (el
 * backend valida lo mismo y devuelve 409, pero conviene avisar antes de
 * intentarlo). Ver PATCH `movimiento_bancario/{id}/casar`.
 */
export const bloqueoConciliarMovimientoBancario = (movimiento: MovimientoBancario): BloqueoConciliarMovimiento => {
    if (!movimiento.cuentaBancoId) {
        return {
            bloqueado: true,
            motivo: "Asocia la cuenta en Tesorería / Conexiones bancarias para poder conciliar este movimiento.",
        };
    }
    if (movimiento.pendiente) {
        return {
            bloqueado: true,
            motivo: "El banco todavía no ha confirmado este movimiento; espera a la próxima sincronización.",
        };
    }
    if (movimiento.eliminadoEnBanco) {
        return {
            bloqueado: true,
            motivo: "El banco ya no devuelve este movimiento; no se puede conciliar.",
        };
    }
    return { bloqueado: false, motivo: null };
};

const ETIQUETA_ORIGEN: Record<OrigenConciliacionMovimiento, string> = {
    determinista: "Automática (reglas)",
    ia: "Automática (IA)",
    manual: "Manual",
};

export const etiquetaOrigenConciliacion = (origen: OrigenConciliacionMovimiento | null): string =>
    origen ? ETIQUETA_ORIGEN[origen] : "—";
