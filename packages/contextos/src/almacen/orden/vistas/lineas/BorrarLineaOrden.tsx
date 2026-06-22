import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useContext } from "react";
import { LineaOrdenAlmacenConId } from "../../diseño.ts";
import { borrarLineasOrden } from "../../infraestructura.ts";

export const BorrarLineaOrden = ({
    publicar,
    activo = false,
    linea,
    ordenId,
}: {
    publicar: ProcesarEvento;
    linea: LineaOrdenAlmacenConId | null;
    activo: boolean;
    ordenId: string;
}) => {
    const { intentar } = useContext(ContextoError);

    const borrar = async () => {
        if (linea?.id) {
            await intentar(() => borrarLineasOrden(ordenId, [linea.id]));
        }
        publicar("linea_orden_borrada");
    };

    return (
        <QModalConfirmacion
            nombre="confirmarBorrarLineaOrden"
            abierto={activo}
            titulo="Confirmar borrado"
            mensaje="¿Está seguro de que desea borrar esta línea?"
            onCerrar={() => publicar("borrado_cancelado")}
            onAceptar={borrar}
        />
    );
};
