import { ClausulaFiltro } from "@olula/lib/diseño.ts";
import {
    CandidatoConciliacion,
    EstadoMovimientoBancario,
    ItemConciliacion,
    MovimientoBancario,
    OrigenConciliacionMovimiento,
    TipoConciliacion,
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
    numConciliaciones: 0,
    probabilidadMaxima: null,
    numItemsConciliacion: 0,
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
    conciliado: "Conciliado",
    ignorado: "Ignorado",
};

type VarianteEtiqueta = "exito" | "error" | "advertencia" | "primario" | "gris";

/** Conciliado en verde, con candidatos en naranja y pendiente en rojo. */
export const VARIANTE_ESTADO_MOVIMIENTO_BANCARIO: Record<EstadoMovimientoBancario, VarianteEtiqueta> = {
    pendiente: "error",
    candidatos: "advertencia",
    conciliado: "exito",
    ignorado: "gris",
};

export const etiquetaEstadoMovimientoBancario = (estado: EstadoMovimientoBancario): string =>
    ETIQUETA_ESTADO_MOVIMIENTO_BANCARIO[estado];

/** Etiqueta de la lista: con candidatos, cuántos hay. */
export const etiquetaEstadoConConciliaciones = (movimiento: MovimientoBancario): string =>
    movimiento.estado === "candidatos" && movimiento.numConciliaciones > 0
        ? `${movimiento.numConciliaciones} candidato${movimiento.numConciliaciones === 1 ? "" : "s"}`
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

/**
 * Resumen del resultado de conciliación para mostrar en la lista.
 * Como ahora el movimiento puede tener varios ítems, muestra el número.
 */
export const reciboAsociadoMovimientoBancario = (movimiento: MovimientoBancario): string => {
    if (movimiento.numItemsConciliacion === 0) return "—";
    return movimiento.numItemsConciliacion === 1 ? "1 ítem" : `${movimiento.numItemsConciliacion} ítems`;
};

const RUTA_RECIBO: Record<TipoReciboMovimiento, string> = {
    cobro: "/tesoreria/recibo_venta",
    pago: "/tesoreria/recibo_compra",
};

/** Clase de recibo que liquida cada tipo de conciliación (los de asiento, ninguno). */
const TIPO_RECIBO_CONCILIACION: Partial<Record<TipoConciliacion, TipoReciboMovimiento>> = {
    cobrar_recibo_venta: "cobro",
    cobro_parcial_venta: "cobro",
    pagar_recibo_compra: "pago",
    pago_parcial_compra: "pago",
};

export const tipoReciboConciliacion = (tipo: TipoConciliacion | null): TipoReciboMovimiento | null =>
    (tipo && TIPO_RECIBO_CONCILIACION[tipo]) ?? null;

const ETIQUETA_TIPO_CONCILIACION: Record<TipoConciliacion, string> = {
    cobrar_recibo_venta: "Cobro de recibo",
    pagar_recibo_compra: "Pago de recibo",
    cobro_parcial_venta: "Cobro parcial",
    pago_parcial_compra: "Pago parcial",
    asiento_manual: "Asiento manual",
    asiento_vinculado: "Asiento vinculado",
    cuota_prestamo: "Cuota de préstamo",
};

export const etiquetaTipoConciliacion = (tipo: TipoConciliacion): string => ETIQUETA_TIPO_CONCILIACION[tipo];

export const esConciliacionParcial = (tipo: TipoConciliacion): boolean =>
    tipo === "cobro_parcial_venta" || tipo === "pago_parcial_compra";

/** Tipos de conciliación que piden datos al usuario antes de conciliar. */
export const pideDatosConciliacion = (tipo: TipoConciliacion): boolean => tipo === "asiento_manual";

/** Probabilidad a partir de la cual el servidor concilia sin preguntar. */
export const PROBABILIDAD_CONCILIAR_AUTOMATICAMENTE = 95;

export const varianteProbabilidad = (probabilidad: number): VarianteEtiqueta =>
    probabilidad >= PROBABILIDAD_CONCILIAR_AUTOMATICAMENTE
        ? "exito"
        : probabilidad >= 60 ? "advertencia" : "gris";

/** Enlace a la ficha del recibo (de venta si es un cobro, de compra si es un pago). */
export const urlRecibo = (tipoRecibo: TipoReciboMovimiento, reciboId: string): string =>
    `${RUTA_RECIBO[tipoRecibo]}?id=${encodeURIComponent(reciboId)}`;

/**
 * URL del recibo del primer ítem de casación del movimiento conciliado.
 * Devuelve `null` si no hay ítems o el tipo no tiene recibo asociado.
 */
export const urlReciboMovimientoBancario = (_movimiento: MovimientoBancario): string | null =>
    null;

/** URL del recibo del primer ítem de una conciliación candidata (para el enlace "Ver recibo"). */
export const urlReciboConciliacion = (item: ItemConciliacion): string | null => {
    const tipoRecibo = tipoReciboConciliacion(item.tipo);
    return tipoRecibo && item.recibo ? urlRecibo(tipoRecibo, item.recibo.id) : null;
};

/** Conciliación a mano con un recibo elegido en la búsqueda: completa por su importe, parcial si es mayor. */
export const conciliacionDesdeCandidato = (
    movimiento: MovimientoBancario,
    candidato: CandidatoConciliacion
): ItemConciliacion => {
    const params: Record<string, unknown> = esConciliacionParcial(candidato.tipoConciliacion)
        ? { recibo_id: Number(candidato.reciboId), importe: Math.abs(movimiento.importe).toFixed(2) }
        : { recibo_id: Number(candidato.reciboId) };
    return {
        tipo: candidato.tipoConciliacion,
        params,
        recibo: {
            id: candidato.reciboId,
            codigo: candidato.codigo,
            tercero: candidato.tercero,
            importe: candidato.importe,
            fechaVencimiento: candidato.fechaVencimiento,
            estado: candidato.estado,
            fechaEmision: null,
            fechaCobro: null,
        },
        cuota: null,
    };
};

/** Lo que quedaría pendiente en el recibo nuevo tras un cobro o pago parcial. */
export const restoConciliacionParcial = (movimiento: MovimientoBancario, importeRecibo: number): number =>
    Math.round((importeRecibo - Math.abs(movimiento.importe)) * 100) / 100;

export const esIngresoMovimientoBancario = (movimiento: MovimientoBancario): boolean =>
    movimiento.importe >= 0;

export type BloqueoConciliarMovimiento = {
    bloqueado: boolean;
    motivo: string | null;
};

/**
 * Motivos por los que la UI debe impedir conciliar antes de llamar a la API (el
 * backend valida lo mismo y devuelve 409, pero conviene avisar antes de
 * intentarlo). Ver PATCH `movimiento_bancario/{id}/conciliar`.
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
