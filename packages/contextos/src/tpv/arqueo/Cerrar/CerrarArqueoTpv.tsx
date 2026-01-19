import { ArqueoTpv } from "#/tpv/arqueo/diseño.ts";
import { patchCerrarArqueo } from "#/tpv/arqueo/infraestructura.ts";
import { agenteActivo } from "#/tpv/comun/infraestructura.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import "./CerrarArqueoTpv.css";
import { cierreArqueoTpvVacio, metaCierreArqueoTpv } from "./diseño.ts";

export const CerrarArqueoTpv = ({
    arqueo,
    publicar,
}: {
    arqueo: ArqueoTpv,
    publicar: EmitirEvento;
}) => {
    const { intentar } = useContext(ContextoError);

    const { modelo, uiProps, valido, init } = useModelo(metaCierreArqueoTpv, {
        ...cierreArqueoTpvVacio,
        idAgenteCierre: agenteActivo.obtener()?.id ?? '',
    });

    const [cerrando, setCerrando] = useState(false);
  
    const cerrar = useCallback(
        async () => {
            setCerrando(true);
            await intentar(() => patchCerrarArqueo(arqueo.id, modelo));
            publicar("cierre_hecho");
        },
        [arqueo, intentar, modelo, publicar, setCerrando]
    );

    const cancelar = useCallback(
        () => {
            if (!cerrando) publicar("cierre_cancelado");
        },
        [cerrando, publicar]
    );

    const limpiar = () => {
        init({
            ...cierreArqueoTpvVacio,
            idAgenteCierre: agenteActivo.obtener()?.id ?? '',
        });
    }
    
    return (
        <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
    
            <div className="CierreArqueo">
            
                <h2>Cierre de arqueo</h2>

                <quimera-formulario>
                    <QInput label="Movimiento de cierre" {...uiProps("movimientoCierre")} />
                </quimera-formulario>
            
                <div className="botones maestro-botones ">
                    <QBoton onClick={limpiar}>Limpiar</QBoton>
                </div>

                <div className="botones maestro-botones ">
                    <QBoton onClick={cerrar}
                        deshabilitado={!valido}>
                        Cerrar    
                    </QBoton>
                </div>

            </div>

        </QModal>
    );
};
