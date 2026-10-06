/**
 * Estados en los que el recibo admite pago. El servidor manda el estado como
 * texto libre («Emitido» = pendiente), así que se compara sin mayúsculas.
 */
const ESTADOS_PAGABLES = ["emitido", "devuelto"];

export const reciboCompraPagable = (recibo: { estado: string }): boolean =>
    ESTADOS_PAGABLES.includes(recibo.estado.trim().toLowerCase());
