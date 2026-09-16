import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { ArticuloTarifa } from "../diseño.js";
import { descripcionArticuloTarifa } from "../dominio.js";
import { deleteArticuloTarifa } from "../infraestructura.js";

export const BorrarArticuloTarifa = ({
    articulo,
    publicar,
}: {
    articulo: ArticuloTarifa;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(
        async () => {
            await deleteArticuloTarifa(articulo.id);
            publicar("articulo_borrado", articulo.id);
        },
        [articulo, publicar]
    );

    const cancelar_ = useCallback(
        () => publicar("borrado_de_articulo_cancelado"),
        [publicar]
    );

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="confirmarBorrarArticuloTarifa"
            abierto={true}
            titulo="Quitar artículo de la tarifa"
            mensaje={`¿Está seguro de que desea quitar el artículo ${descripcionArticuloTarifa(articulo)} de la tarifa?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
