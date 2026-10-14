import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { MovimientoBancario } from "../diseño.js";
import { reciboAsociadoMovimientoBancario } from "../dominio.js";

export const DesconciliarMovimientoBancario = ({
    movimiento,
    publicar,
}: {
    movimiento: MovimientoBancario;
    publicar: EmitirEvento;
}) => {
    const desconciliar_ = useCallback(async () => publicar("desconciliacion_confirmada"), [publicar]);
    const cancelar_ = useCallback(() => publicar("desconciliacion_cancelada"), [publicar]);

    const [desconciliar, cancelar] = useForm(desconciliar_, cancelar_);

    const mensaje = [
        `Se anulará el pago del recibo ${reciboAsociadoMovimientoBancario(movimiento)} y volverá a quedar pendiente.`,
        "",
        "Si el banco ya no devuelve este movimiento, desaparecerá de la lista tras desconciliarlo.",
    ].join("\n");

    return (
        <QModalConfirmacion
            nombre="desconciliarMovimientoBancario"
            abierto={true}
            titulo="Desconciliar movimiento"
            mensaje={mensaje}
            onCerrar={cancelar}
            onAceptar={desconciliar}
            labelAceptar="Desconciliar"
        />
    );
};
