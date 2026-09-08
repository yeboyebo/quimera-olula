import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { Albaran } from "../diseño.ts";
import { deleteAlbaran } from "../infraestructura.ts";

export const BorrarAlbaran = ({
    albaran,
    publicar,
}: {
    albaran: Albaran;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(async () => {
        await deleteAlbaran(albaran.id);
        publicar("albaran_borrado", albaran.id);
    }, [albaran, publicar]);

    const cancelar_ = useCallback(() => publicar("borrado_cancelado"), [publicar]);

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="borrarAlbaranCompra"
            abierto={true}
            titulo="Borrar albarán"
            mensaje={`¿Está seguro de que desea borrar el albarán ${albaran.codigo}?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
