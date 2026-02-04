import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { VentaTpv } from "../diseño.ts";
import { deleteVentaTpv } from "../infraestructura.ts";

export const BorrarVentaTpv = ({
    publicar,
    venta,
}: {
    venta: VentaTpv;
    publicar: EmitirEvento;
}) => {

    const borrar_ = useCallback(
        async () => {
            await deleteVentaTpv(venta.id);
            publicar("venta_borrada", venta);
        },
        [publicar, venta]
    );

    const cancelar_ = useCallback(
        () => publicar("borrado_de_venta_cancelado"),
        [publicar]
    );

    const [borrar, cancelar] = useForm(borrar_, cancelar_);
    
    return (
        <QModalConfirmacion
            nombre="borrarVenta"
            abierto={true}
            titulo="Borrar venta"
            mensaje={`¿Está seguro de que desea borrar la venta ${venta.codigo}?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
