import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { MovimientoBancario } from "../diseño.js";

export const ReactivarMovimientoBancario = ({
    movimiento,
    publicar,
}: {
    movimiento: MovimientoBancario;
    publicar: EmitirEvento;
}) => {
    const reactivar_ = useCallback(async () => publicar("reactivacion_confirmada"), [publicar]);
    const cancelar_ = useCallback(() => publicar("reactivacion_cancelada"), [publicar]);

    const [reactivar, cancelar] = useForm(reactivar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="reactivarMovimientoBancario"
            abierto={true}
            titulo="Reactivar movimiento"
            mensaje={`El movimiento "${movimiento.concepto}" volverá a estado pendiente y podrás conciliarlo con un recibo.`}
            onCerrar={cancelar}
            onAceptar={reactivar}
            labelAceptar="Reactivar"
        />
    );
};
