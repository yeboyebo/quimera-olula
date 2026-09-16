import { ClausulaFiltro } from "@olula/lib/diseño.ts";
import { ReciboVenta } from "./diseño.ts";

/**
 * Estados en los que el recibo admite cobro. El servidor manda el estado como
 * texto libre, así que se compara sin distinguir mayúsculas ni espacios.
 */
const ESTADOS_PAGABLES = ["emitido", "devuelto"];

export const reciboPagable = (recibo: ReciboVenta): boolean =>
    ESTADOS_PAGABLES.includes(recibo.estado.trim().toLowerCase());

/** Solo se agrupan recibos de un mismo cliente: el grupo hereda su cliente y divisa. */
export const puedenAgruparse = (recibos: ReciboVenta[]): boolean =>
    recibos.length > 0 &&
    recibos.every((recibo) => recibo.clienteId === recibos[0].clienteId);

/** Prefijo con el que el servidor codifica los recibos de grupo: "GRC" + nº a 9 dígitos. */
const PREFIJO_GRUPO = "GRC";

/** Un recibo de grupo no nace de una factura: su factura_id llega nulo. */
export const esGrupoDeRecibos = (recibo: ReciboVenta): boolean =>
    !recibo.facturaId &&
    recibo.codigo.trim().toUpperCase().startsWith(PREFIJO_GRUPO);

export const reciboDesagrupable = (recibo: ReciboVenta): boolean =>
    esGrupoDeRecibos(recibo) && recibo.estado.trim().toLowerCase() === "emitido";

/** Estados que el servidor asigna a un recibo de venta. */
export const ESTADOS_RECIBO_VENTA = [
    "Emitido",
    "Pagado",
    "Devuelto",
    "Agrupado",
    "Remesado",
] as const;

/** Al entrar interesan los recibos vivos: ni los ya cobrados ni los absorbidos por un grupo. */
export const ESTADOS_RECIBO_VENTA_DEFECTO = ESTADOS_RECIBO_VENTA.filter(
    (estado) => estado !== "Pagado" && estado !== "Agrupado"
);

export const opcionesEstadoReciboVenta = ESTADOS_RECIBO_VENTA.map((estado) => ({
    valor: estado,
    descripcion: estado,
}));

const comoLista = (valor: unknown): string[] =>
    Array.isArray(valor)
        ? valor.map(String).filter(Boolean)
        : typeof valor === "string"
            ? valor.split(",").map((v) => v.trim()).filter(Boolean)
            : [];

export const filtroEstadoReciboVenta = (valor: unknown): ClausulaFiltro | null => {
    const estados = comoLista(valor);
    if (!estados.length) return null;

    return ["estado", "in", estados as unknown as string] as ClausulaFiltro;
};

export const estadosDesdeFiltro = (filtro: ClausulaFiltro[]): string[] => {
    const clausula = filtro.find(([campo, operador]) => campo === "estado" && operador === "in");

    return clausula ? comoLista(clausula[2]) : [];
};
