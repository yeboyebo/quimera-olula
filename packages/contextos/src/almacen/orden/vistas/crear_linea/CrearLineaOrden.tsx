import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useMemo } from "react";
import { crearLineasOrden } from "../../infraestructura.ts";
import { nuevaLineaOrdenVacia } from "./crear_linea.ts";
import { metaNuevaLineaOrden } from "./diseño.ts";

export const CrearLineaOrden = ({
    publicar,
    ordenId,
}: {
    publicar: ProcesarEvento;
    ordenId: string;
}) => {
    const { intentar } = useContext(ContextoError);

    const lineaInicial = useMemo(() => nuevaLineaOrdenVacia, []);

    const { modelo, uiProps, valido, init } = useModelo(
        metaNuevaLineaOrden,
        lineaInicial
    );

    const crear = useCallback(async () => {
        await intentar(() =>
            crearLineasOrden(ordenId, [
                {
                    sku: modelo.sku,
                    cantidadPrevista: modelo.cantidadPrevista,
                    loteId: null,
                    ubicacionOrigenId: null,
                    cajaOrigenId: null,
                    ubicacionDestinoId: null,
                    cajaDestinoId: null,
                },
            ])
        );
        publicar("linea_creada", {
            id: crypto.randomUUID(),
            sku: modelo.sku,
            cantidadPrevista: modelo.cantidadPrevista,
            loteId: null,
            ubicacionOrigenId: null,
            cajaOrigenId: null,
            ubicacionDestinoId: null,
            cajaDestinoId: null,
        });
        init();
    }, [modelo, publicar, ordenId, intentar, init]);

    const cancelar = useCallback(() => {
        init();
        publicar("creacion_cancelada");
    }, [publicar, init]);

    return (
        <QModal
            abierto={true}
            nombre="crearLineaOrden"
            titulo="Nueva línea"
            onCerrar={cancelar}
        >
            <div className="CrearLineaOrden">
                <quimera-formulario>
                    <QInput label="SKU" {...uiProps("sku")} />
                    <QInput label="Cantidad prevista" {...uiProps("cantidadPrevista")} />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>
                        Guardar
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
