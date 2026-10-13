import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { CandidatoConciliacion, MovimientoBancario } from "../diseño.js";

/**
 * Confirmación de conciliación manual: la lógica (PATCH `.../conciliar`) vive
 * en detalle/detalle.ts (onConciliado), que ya conoce el candidato elegido
 * (`ctx.candidatoSeleccionado`) — este modal solo confirma o cancela.
 */
export const ConciliarMovimientoBancario = ({
    movimiento,
    candidato,
    publicar,
}: {
    movimiento: MovimientoBancario;
    candidato: CandidatoConciliacion;
    publicar: EmitirEvento;
}) => {
    const conciliar_ = useCallback(async () => publicar("conciliacion_confirmada"), [publicar]);
    const cancelar_ = useCallback(() => publicar("conciliacion_cancelada"), [publicar]);

    const [conciliar, cancelar] = useForm(conciliar_, cancelar_);

    const divisa = movimiento.divisa ?? "EUR";

    const mensaje = [
        `Movimiento: ${formatearFechaDate(movimiento.fecha)} · ${movimiento.concepto} · ${formatearMoneda(movimiento.importe, divisa)}`,
        "",
        `Recibo: ${candidato.codigo}${candidato.facturaCodigo ? ` (fra. ${candidato.facturaCodigo})` : ""} · ${candidato.tercero ?? "Sin tercero"} · vence ${formatearFechaDate(candidato.fechaVencimiento)} · ${formatearMoneda(candidato.importe, divisa)}`,
        "",
        "El recibo quedará pagado con la fecha del movimiento y marcado como conciliado.",
    ].join("\n");

    return (
        <QModalConfirmacion
            nombre="conciliarMovimientoBancario"
            abierto={true}
            titulo="Conciliar movimiento"
            mensaje={mensaje}
            onCerrar={cancelar}
            onAceptar={conciliar}
            labelAceptar="Conciliar"
        />
    );
};
