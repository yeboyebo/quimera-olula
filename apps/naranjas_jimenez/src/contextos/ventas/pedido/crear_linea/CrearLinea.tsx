import { CrearLineaProps } from "#/ventas/pedido/crear_linea/CrearLinea.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useFocus } from "@olula/lib/useFocus.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { TipoPalet } from "../../comun/componentes/TipoPalet.tsx";
import { Variedad } from "../../comun/componentes/Variedad.tsx";
import { postLineaNrj } from "../infraestructura.ts";
import "./CrearLinea.css";
import { FormCrearLineaDefecto, metaCrearLinea } from "./crear_linea.ts";

export const CrearLineaNrj = ({
    pedidoId,
    publicar,
}: CrearLineaProps) => {

    const { intentar } = useContext(ContextoError);
    const { modelo, uiProps, valido } = useModelo(
        metaCrearLinea,
        FormCrearLineaDefecto
    );
    const [creando, setCreando] = useState(false);
    const focus = useFocus();

    const crear = useCallback(async () => {
        await intentar(() => postLineaNrj(pedidoId, modelo));
        setCreando(true);
        publicar("alta_linea_lista");
    }, [modelo, publicar, pedidoId, intentar]);

    const cancelar = useCallback(() => {
        if (!creando) publicar("crear_linea_cancelado");
    }, [creando, publicar]);

    return (
        <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
            <div className="CrearLinea">
                
                <h2>Crear línea NRJ</h2>

                <quimera-formulario>
                    <Variedad label="Variedad" {...uiProps("idVariedad", "variedad")}  />
                    <TipoPalet label="Tipo Palet" {...uiProps("idTipoPalet", "tipopalet")}  />
                    <QInput label="Cantidad Palets" {...uiProps("cantidadPalets") } nombre='cantidadPalets'/>
                    <QInput label="Cantidad Envases" {...uiProps("cantidadEnvases") } nombre='cantidadEnvases'/>
                </quimera-formulario>

                <div className="botones maestro-botones ">
                    <QBoton texto='Crear' onClick={crear} deshabilitado={!valido}
                    />
                </div>
            </div>
        </QModal>
    );
};
