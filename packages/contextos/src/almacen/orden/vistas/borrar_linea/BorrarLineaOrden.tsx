import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useCallback } from "react";
import { LineaOrdenAlmacen } from "../../diseño.ts";
import { borrarLineasOrden } from "../../infraestructura.ts";

export const BorrarLineaOrden = ({
    publicar,
    linea,
    ordenId,
}: {
    publicar: ProcesarEvento;
    linea: LineaOrdenAlmacen;
    ordenId: string;
}) => {
    const borrar_ = useCallback(async () => {
        await borrarLineasOrden(ordenId, [linea.id]);
        publicar("linea_orden_borrada");
    }, [publicar, linea.id, ordenId]);

    const cancelar_ = useCallback(() => {
        publicar("borrado_cancelado");
    }, [publicar]);

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="confirmarBorrarLineaOrden"
            abierto={true}
            titulo="Confirmar borrado"
            mensaje="¿Está seguro de que desea borrar esta línea?"
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
