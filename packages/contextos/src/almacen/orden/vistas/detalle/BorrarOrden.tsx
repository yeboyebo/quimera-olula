import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useContext } from "react";
import { OrdenAlmacen } from "../../diseño.ts";
import { borrarOrden } from "../../infraestructura.ts";

export const BorrarOrden = ({
    publicar,
    activo = false,
    orden,
}: {
    publicar: ProcesarEvento;
    activo: boolean;
    orden: OrdenAlmacen;
}) => {
    const { intentar } = useContext(ContextoError);

    const borrar = async () => {
        await intentar(() => borrarOrden(orden.id));
        publicar("orden_borrada", orden);
    };

    return (
        <QModalConfirmacion
            nombre="confirmarBorrarOrden"
            abierto={activo}
            titulo="Confirmar borrado"
            mensaje={`¿Está seguro de que desea borrar la orden "${orden.tipoOrden}"?`}
            onCerrar={() => publicar("borrado_cancelado")}
            onAceptar={borrar}
        />
    );
};
