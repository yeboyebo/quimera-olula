import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { Proveedor } from "../diseño.ts";
import { deleteProveedor } from "../infraestructura.ts";

export const BorrarProveedor = ({
    proveedor,
    publicar,
}: {
    proveedor: Proveedor;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(async () => {
        await deleteProveedor(proveedor.id);
        publicar("proveedor_borrado", proveedor.id);
    }, [proveedor, publicar]);

    const cancelar_ = useCallback(() => publicar("borrado_cancelado"), [publicar]);

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="borrarProveedor"
            abierto={true}
            titulo="Borrar proveedor"
            mensaje={`¿Está seguro de que desea borrar el proveedor ${proveedor.nombre}?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
