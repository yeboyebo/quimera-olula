import { ClausulaFiltro } from "@olula/lib/diseño.ts";
import {
    EstadoMovimientoBancario,
    MovimientoBancario,
    OrigenConciliacionMovimiento,
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
    tipoRecibo: null,
    reciboId: null,
    codigoRecibo: null,
    nombreTercero: null,
    puntuacion: null,
    origenConciliacion: null,
    justificacion: null,
    conciliadoPor: null,
    conciliadoEn: null,
    eliminadoEnBanco: false,
    requiereRevision: false,
};

export const ESTADOS_MOVIMIENTO_BANCARIO: EstadoMovimientoBancario[] = [
    "pendiente",
    "sugerido",
    "conciliado",
    "ignorado",
];

/** Vista por defecto del maestro: se ocultan los ya resueltos (conciliados/ignorados). */
export const ESTADOS_MOVIMIENTO_BANCARIO_DEFECTO: EstadoMovimientoBancario[] = [
    "pendiente",
    "sugerido",
];

export const ETIQUETA_ESTADO_MOVIMIENTO_BANCARIO: Record<EstadoMovimientoBancario, string> = {
    pendiente: "Pendiente",
    sugerido: "Sugerido",
    conciliado: "Conciliado",
    ignorado: "Ignorado",
};

type VarianteEtiqueta = "exito" | "error" | "advertencia" | "primario";

export const VARIANTE_ESTADO_MOVIMIENTO_BANCARIO: Record<EstadoMovimientoBancario, VarianteEtiqueta> = {
    pendiente: "advertencia",
    sugerido: "primario",
    conciliado: "exito",
    ignorado: "error",
};

export const etiquetaEstadoMovimientoBancario = (estado: EstadoMovimientoBancario): string =>
    ETIQUETA_ESTADO_MOVIMIENTO_BANCARIO[estado];

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

/** Enlace a la ficha del recibo (de venta si es un cobro, de compra si es un pago). */
export const urlRecibo = (tipoRecibo: TipoReciboMovimiento, reciboId: string): string =>
    `${RUTA_RECIBO[tipoRecibo]}?id=${encodeURIComponent(reciboId)}`;

export const urlReciboMovimientoBancario = (movimiento: MovimientoBancario): string | null =>
    movimiento.tipoRecibo && movimiento.reciboId
        ? urlRecibo(movimiento.tipoRecibo, movimiento.reciboId)
        : null;

export const esIngresoMovimientoBancario = (movimiento: MovimientoBancario): boolean =>
    movimiento.importe >= 0;

export type BloqueoConciliarMovimiento = {
    bloqueado: boolean;
    motivo: string | null;
};

/**
 * Motivos por los que la UI debe impedir pulsar "Conciliar" antes de llamar a
 * la API (el backend valida lo mismo y devuelve 409, pero conviene avisar
 * antes de intentarlo). Ver PATCH `movimiento_bancario/{id}/conciliar`.
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
