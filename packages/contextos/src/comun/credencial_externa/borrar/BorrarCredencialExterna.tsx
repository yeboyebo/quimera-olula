import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { CredencialExterna } from "../diseño.js";
import { deleteCredencialExterna } from "../infraestructura.js";

export const BorrarCredencialExterna = ({
    publicar,
    credencial,
}: {
    credencial: CredencialExterna;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(
        async () => {
            await deleteCredencialExterna(credencial.id);
            publicar("credencial_externa_borrada", credencial);
        },
        [publicar, credencial]
    );

    const cancelar_ = useCallback(
        () => publicar("borrado_cancelado"),
        [publicar]
    );

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="borrarCredencialExterna"
            abierto={true}
            titulo="Borrar credencial"
            mensaje={`¿Está seguro de que desea borrar "${credencial.nombre}"?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
