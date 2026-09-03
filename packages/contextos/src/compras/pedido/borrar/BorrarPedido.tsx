import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { Pedido } from "../diseño.ts";
import { deletePedido } from "../infraestructura.ts";

export const BorrarPedido = ({
    pedido,
    publicar,
}: {
    pedido: Pedido;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(async () => {
        await deletePedido(pedido.id);
        publicar("pedido_borrado", pedido.id);
    }, [pedido, publicar]);

    const cancelar_ = useCallback(() => publicar("borrado_cancelado"), [publicar]);

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="borrarPedidoCompra"
            abierto={true}
            titulo="Borrar pedido"
            mensaje={`¿Está seguro de que desea borrar el pedido ${pedido.codigo}?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
