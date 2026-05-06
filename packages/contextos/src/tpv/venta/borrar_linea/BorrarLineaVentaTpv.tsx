import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { VentaTpv } from "../diseño.ts";
import { deleteLinea } from "../infraestructura.ts";

export const BorrarLineaVentaTpv = ({
    venta,
    publicar,
    idLinea,
}: {
    venta: VentaTpv;
    publicar: EmitirEvento;
    idLinea: string;
}) => {
    
    const borrar_ = useCallback(
        async () => {
            await deleteLinea(venta.id, idLinea);
            publicar("linea_borrada", idLinea);
        },
        [idLinea, publicar, venta.id]
    );

    const cancelar_ = useCallback(
        () => publicar("borrado_de_linea_cancelado"),
        [publicar]
    );

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="confirmarBorrarLinea"
            abierto={true}
            titulo="Borrar línea"
            mensaje="¿Está seguro de que desea borrar esta línea?"
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
