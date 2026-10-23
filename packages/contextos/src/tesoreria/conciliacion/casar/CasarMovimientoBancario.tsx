import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { CasacionSeleccionada } from "../detalle/diseño.js";
import { MovimientoBancario } from "../diseño.js";
import { esCasacionParcial, etiquetaTipoCasacion, restoCasacionParcial } from "../dominio.js";

/**
 * Confirmación de una casación de recibo (completa o parcial): la llamada a
 * la API (PATCH `.../casar`) vive en detalle/detalle.ts (onCasado), que ya
 * conoce la casación elegida (`ctx.casacionSeleccionada`); este modal solo
 * confirma o cancela.
 */
export const CasarMovimientoBancario = ({
    movimiento,
    casacion,
    publicar,
}: {
    movimiento: MovimientoBancario;
    casacion: CasacionSeleccionada;
    publicar: EmitirEvento;
}) => {
    const casar_ = useCallback(async () => publicar("casacion_confirmada"), [publicar]);
    const cancelar_ = useCallback(() => publicar("casacion_cancelada"), [publicar]);

    const [casar, cancelar] = useForm(casar_, cancelar_);

    const divisa = movimiento.divisa ?? "EUR";
    const { recibo } = casacion;
    const parcial = esCasacionParcial(casacion.tipo);

    const mensaje = [
        `Movimiento: ${formatearFechaDate(movimiento.fecha)} · ${movimiento.concepto} · ${formatearMoneda(movimiento.importe, divisa)}`,
        "",
        recibo
            ? `Recibo: ${recibo.codigo} · ${recibo.tercero ?? "Sin tercero"} · vence ${formatearFechaDate(recibo.fechaVencimiento)} · ${formatearMoneda(recibo.importe, divisa)}`
            : "",
        casacion.justificacion ? `Motivo: ${casacion.justificacion}` : "",
        "",
        parcial && recibo
            ? `Se pagarán ${formatearMoneda(Math.abs(movimiento.importe), divisa)} del recibo con la fecha del movimiento y los ${formatearMoneda(restoCasacionParcial(movimiento, recibo.importe), divisa)} restantes quedarán en un recibo nuevo.`
            : "El recibo quedará pagado con la fecha del movimiento y el movimiento, casado.",
    ].filter((linea, i, lineas) => linea !== "" || lineas[i - 1] !== "").join("\n");

    return (
        <QModalConfirmacion
            nombre="casarMovimientoBancario"
            abierto={true}
            titulo={etiquetaTipoCasacion(casacion.tipo)}
            mensaje={mensaje}
            onCerrar={cancelar}
            onAceptar={casar}
            labelAceptar="Casar"
        />
    );
};
