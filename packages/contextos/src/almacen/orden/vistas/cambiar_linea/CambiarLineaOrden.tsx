import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useCallback, useContext } from "react";
import { LineaOrdenAlmacenConId } from "../../diseño.ts";
import { metaNuevaLinea } from "../../dominio.ts";
import { cambiarLineaOrden } from "../../infraestructura.ts";

export const CambiarLineaOrden = ({
    publicar,
    linea,
    ordenId,
}: {
    publicar: ProcesarEvento;
    linea: LineaOrdenAlmacenConId;
    ordenId: string;
}) => {
    const { intentar } = useContext(ContextoError);

    const { modelo, uiProps, valido } = useModelo(metaNuevaLinea, linea);

    const guardar = useCallback(async () => {
        await intentar(() => cambiarLineaOrden(ordenId, linea.id, modelo));
        publicar("linea_orden_cambiada", modelo);
    }, [modelo, publicar, ordenId, linea.id, intentar]);

    const cancelar = useCallback(() => {
        publicar("edicion_cancelada");
    }, [publicar]);

    return (
        <QModal
            abierto={true}
            nombre="cambiarLineaOrden"
            titulo="Edición de línea"
            onCerrar={cancelar}
        >
            <div className="CambiarLineaOrden">
                <quimera-formulario>
                    <QInput label="SKU" {...uiProps("sku")} />
                    <QInput label="Cantidad prevista" {...uiProps("cantidadPrevista")} />
                    <QInput label="Cantidad real" {...uiProps("cantidadReal")} />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={guardar} deshabilitado={!valido}>
                        Guardar
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
