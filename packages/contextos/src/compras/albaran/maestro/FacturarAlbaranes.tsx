import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";

export const FacturarAlbaranes = ({
    albaranes,
    publicar,
}: {
    albaranes: number;
    publicar: EmitirEvento;
}) => {
    const facturar_ = useCallback(
        async () => publicar("facturado_confirmado"),
        [publicar]
    );

    const cancelar_ = useCallback(
        () => publicar("facturado_cancelado"),
        [publicar]
    );

    const [facturar, cancelar] = useForm(facturar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="facturarAlbaranesCompra"
            abierto={true}
            titulo="Facturar albaranes"
            mensaje={`¿Facturar ${albaranes === 1 ? "el albarán seleccionado" : `los ${albaranes} albaranes seleccionados`}?`}
            onCerrar={cancelar}
            onAceptar={facturar}
        />
    );
};
