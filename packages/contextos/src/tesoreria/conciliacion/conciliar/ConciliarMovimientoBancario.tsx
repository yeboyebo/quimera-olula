import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { ConciliacionSeleccionada } from "../detalle/diseño.js";
import { ItemConciliacion, MovimientoBancario } from "../diseño.js";
import { esConciliacionParcial, etiquetaTipoConciliacion, restoConciliacionParcial } from "../dominio.js";

/** Línea descriptiva de un ítem de conciliación para el cuerpo del modal. */
const lineaItem = (item: ItemConciliacion, movimiento: MovimientoBancario): string => {
    const divisa = movimiento.divisa ?? "EUR";
    if (item.recibo) {
        const recibo = item.recibo;
        const parcial = esConciliacionParcial(item.tipo);
        return parcial
            ? `${etiquetaTipoConciliacion(item.tipo)}: ${recibo.codigo} · ${formatearMoneda(Math.abs(movimiento.importe), divisa)} de ${formatearMoneda(recibo.importe, divisa)} · resto ${formatearMoneda(restoConciliacionParcial(movimiento, recibo.importe), divisa)}`
            : `${etiquetaTipoConciliacion(item.tipo)}: ${recibo.codigo} · ${recibo.tercero ?? "Sin tercero"} · vence ${formatearFechaDate(recibo.fechaVencimiento)} · ${formatearMoneda(recibo.importe, divisa)}`;
    }
    if (item.cuota) {
        const cuota = item.cuota;
        return `Cuota ${cuota.contrato ?? ""} ${formatearFechaDate(cuota.fecha)}: ${formatearMoneda(cuota.capital, divisa)} capital y ${formatearMoneda(cuota.intereses, divisa)} intereses`;
    }
    return etiquetaTipoConciliacion(item.tipo);
};

/**
 * Confirmación de una conciliación de recibo (completa o parcial), cuota de
 * préstamo o multi-ítem: la llamada a la API (PATCH `.../conciliar`) vive en
 * detalle/detalle.ts (onConciliado); este modal solo confirma o cancela.
 */
export const ConciliarMovimientoBancario = ({
    movimiento,
    conciliacion,
    publicar,
}: {
    movimiento: MovimientoBancario;
    conciliacion: ConciliacionSeleccionada;
    publicar: EmitirEvento;
}) => {
    const conciliar_ = useCallback(async () => publicar("conciliacion_confirmada"), [publicar]);
    const cancelar_ = useCallback(() => publicar("conciliacion_cancelada"), [publicar]);

    const [conciliar, cancelar] = useForm(conciliar_, cancelar_);

    const divisa = movimiento.divisa ?? "EUR";
    const item0 = conciliacion.items[0];
    const titulo = item0 ? etiquetaTipoConciliacion(item0.tipo) : "Conciliación";

    const lineasItems = conciliacion.items.map((item) => lineaItem(item, movimiento));
    const mensaje = [
        `Movimiento: ${formatearFechaDate(movimiento.fecha)} · ${movimiento.concepto} · ${formatearMoneda(movimiento.importe, divisa)}`,
        "",
        ...lineasItems,
        conciliacion.justificacion ? `Motivo: ${conciliacion.justificacion}` : "",
        "",
        item0?.cuota
            ? "Se generará el asiento de la cuota: el capital contra la deuda y los intereses contra el gasto, y el banco por el total."
            : item0?.recibo && esConciliacionParcial(item0.tipo)
            ? `Se pagarán ${formatearMoneda(Math.abs(movimiento.importe), divisa)} del recibo con la fecha del movimiento y el resto quedará en un recibo nuevo.`
            : "El recibo quedará pagado con la fecha del movimiento y el movimiento, conciliado.",
    ].filter((linea, i, lineas) => linea !== "" || lineas[i - 1] !== "").join("\n");

    return (
        <QModalConfirmacion
            nombre="conciliarMovimientoBancario"
            abierto={true}
            titulo={titulo}
            mensaje={mensaje}
            onCerrar={cancelar}
            onAceptar={conciliar}
            labelAceptar="Conciliar"
        />
    );
};
