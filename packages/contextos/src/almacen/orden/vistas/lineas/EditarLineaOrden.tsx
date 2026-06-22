import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { LineaOrdenAlmacenConId } from "../../diseño.ts";
import { metaNuevaLinea } from "../../dominio.ts";
import { cambiarLineaOrden } from "../../infraestructura.ts";

export const EditarLineaOrden = ({
    lineaInicial,
    emitir,
    ordenId,
}: {
    lineaInicial: LineaOrdenAlmacenConId;
    emitir: ProcesarEvento;
    ordenId: string;
}) => {
    const { modelo, uiProps, valido } = useModelo(
        metaNuevaLinea,
        lineaInicial
    );

    const { intentar } = useContext(ContextoError);

    const guardar = async () => {
        await intentar(() =>
            cambiarLineaOrden(ordenId, lineaInicial.id, modelo)
        );
        emitir("linea_orden_cambiada", modelo);
    };

    return (
        <div className="EditarLineaOrden">
            <h2>Edición de línea</h2>
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
    );
};
