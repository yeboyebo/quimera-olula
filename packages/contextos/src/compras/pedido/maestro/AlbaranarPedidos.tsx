import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";

export const AlbaranarPedidos = ({
    pedidos,
    publicar,
}: {
    pedidos: number;
    publicar: EmitirEvento;
}) => {
    const albaranar_ = useCallback(
        async () => publicar("albaranado_confirmado"),
        [publicar]
    );

    const cancelar_ = useCallback(
        () => publicar("albaranado_cancelado"),
        [publicar]
    );

    const [albaranar, cancelar] = useForm(albaranar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="albaranarPedidosCompra"
            abierto={true}
            titulo="Albaranar pedidos"
            mensaje={`¿Albaranar ${pedidos === 1 ? "el pedido seleccionado" : `los ${pedidos} pedidos seleccionados`}? Se generará un único albarán con todo lo pendiente.`}
            onCerrar={cancelar}
            onAceptar={albaranar}
        />
    );
};
