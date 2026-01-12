import { agenteActivo } from "#/tpv/comun/infraestructura.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useState } from "react";
import "./CerrarArqueoTpv.css";
import { cierreArqueoTpvVacio, metaCierreArqueoTpv } from "./diseño.ts";

export const CerrarArqueoTpv = ({
    publicar,
}: {
    publicar: EmitirEvento;
}) => {
    

    const { modelo, uiProps, valido, init } = useModelo(metaCierreArqueoTpv, {
        ...cierreArqueoTpvVacio,
        agenteCierreId: agenteActivo.obtener(),
    });

    const [cerrando, setCerrando] = useState(false);
  
    const cerrar = () => {
        setCerrando(true);
        publicar("cierre_listo", modelo);
    };

    const cancelar = useCallback(
        () => {
            if (!cerrando) publicar("cierre_cancelado");
        },
        [cerrando, publicar]
    );

    const limpiar = () => {
        init({
            ...cierreArqueoTpvVacio,
            agenteCierreId: agenteActivo.obtener(),
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
