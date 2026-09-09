import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { LineaPedido, Pedido } from "../diseño.ts";
import { etiquetaLinea } from "../dominio.ts";
import { borrarLineasPedido } from "../infraestructura.ts";

export const BorrarLineaPedido = ({
    pedido,
    linea,
    publicar,
}: {
    pedido: Pedido;
    linea: LineaPedido;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(async () => {
        await borrarLineasPedido(pedido.id, [linea.id]);
        publicar("linea_borrada", linea.id);
    }, [pedido.id, linea.id, publicar]);

    const cancelar_ = useCallback(
        () => publicar("borrado_de_linea_cancelado"),
        [publicar]
    );

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="borrarLineaPedidoCompra"
            abierto={true}
            titulo="Borrar línea"
            mensaje={`¿Está seguro de que desea borrar la línea "${etiquetaLinea(linea)}"?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
