import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { Factura } from "../diseño.ts";
import { deleteFactura } from "../infraestructura.ts";

export const BorrarFactura = ({
    factura,
    publicar,
}: {
    factura: Factura;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(async () => {
        await deleteFactura(factura.id);
        publicar("factura_borrada", factura.id);
    }, [factura, publicar]);

    const cancelar_ = useCallback(() => publicar("borrado_cancelado"), [publicar]);

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="borrarFacturaCompra"
            abierto={true}
            titulo="Borrar factura"
            mensaje={`¿Está seguro de que desea borrar la factura ${factura.codigo}?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
