import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { ArqueoTpv } from "../diseño.ts";
import { deleteArqueoTpv } from "../infraestructura.ts";

export const BorrarArqueoTpv = ({
    publicar,
    arqueo,
}: {
    arqueo: ArqueoTpv;
    publicar: EmitirEvento;
}) => {

    const borrar_ = useCallback(
        async () => {
            await deleteArqueoTpv(arqueo.id);
            publicar("arqueo_borrado", arqueo);
        },
        [publicar, arqueo]
    );

    const cancelar_ = useCallback(
        () => publicar("borrado_de_arqueo_cancelado"),
        [publicar]
    );

    const [borrar, cancelar] = useForm(borrar_, cancelar_);
    
    return (
        <QModalConfirmacion
            nombre="borrarArqueo"
            abierto={true}
            titulo="Borrar arqueo"
            mensaje={`¿Está seguro de que desea borrar el arqueo ${arqueo.id}?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
