import { AgenteTpv as CompAgenteTpv } from "#/tpv/comun/componentes/AgenteTpv.tsx";
import { agenteActivo, puntoVentaLocal } from "#/tpv/comun/infraestructura.ts";
import { QBoton } from "@olula/componentes/index.js";
import { useFocus } from "@olula/lib/useFocus.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useState } from "react";
import { AgenteTpv } from "../diseño.ts";
import { metaCambioAgenteActual } from "./agente_actual.ts";

puntoVentaLocal.actualizar('000001');
// agenteActivo.actualizar('000001');
const miAgenteActivo = agenteActivo.obtener() ;


export const AgenteTpvActual = () => {

    const [cambiando, setCambiando] = useState(false);
    const [agente, setAgente] = useState<AgenteTpv | null>(miAgenteActivo);

    const cambiarAgente = async (agente: AgenteTpv) => {
        console.log('Cambiando agente', agente);
        agenteActivo.actualizar(agente);
        setAgente(agente);
        setCambiando(false);
    };

    return (
        <div className="AgenteActual"> 
            {
                cambiando
                    ?   <CambiarAgenteTpv 
                            agenteActual={agente}
                            cambiar={cambiarAgente}
                            cancelar={() => setCambiando(false)}
                        />
                    : ( 
                        <>
                            <h2>Agente {agente?.nombre ?? ''} </h2>
                            <QBoton texto='...'
                                onClick={() => setCambiando(true)}
                            />
                        </>
                    )
            }
        </div>
    );
};


const CambiarAgenteTpv = ({
    agenteActual,
    cambiar,
    cancelar,
}: {
    agenteActual: AgenteTpv | null,
    cambiar: (agente: AgenteTpv) => void,
    cancelar: () => void
}) => {

    const { modelo, uiProps, valido } = useModelo(metaCambioAgenteActual, {
        idAgente: agenteActual?.id ?? null,
        agente: agenteActual,
    });

    const focus = useFocus();

    const cambiarAgente = () => {
        cambiar(modelo.agente!);
    };

    return (
        <div className="AgenteActual"> 
        {modelo.idAgente}
            <quimera-formulario>
                <CompAgenteTpv 
                    {...uiProps("idAgente", "nombre")}
                    nombre="agente_id"
                    ref={focus}
                />
            </quimera-formulario>
            <div >
                <QBoton texto="Cancelar"
                    onClick={cancelar}
                />
                <QBoton texto="Cambiar agente actual"
                    onClick={cambiarAgente} deshabilitado={!valido}
                />
            </div>
        </div>
    );
};
