import { AgenteTpv } from "#/tpv/comun/componentes/AgenteTpv.tsx";
import { BotonNuevaVentaProps } from "#/tpv/venta/maestro/MaestroConDetalleVentaTpv.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { useState } from "react";

export const BotonNuevaVentaDulceBebe = ({ emitir }: BotonNuevaVentaProps) => {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [agenteId, setAgenteId] = useState<string>("");

    const confirmar = () => {
        setModalAbierto(false);
        emitir("creacion_de_venta_solicitada", { agenteId });
        setAgenteId("");
    };

    return (
        <>
            <div className="maestro-botones">
                <QBoton onClick={() => setModalAbierto(true)}>
                    Nueva Venta
                </QBoton>
            </div>
            <QModal
                nombre="crear-venta-dulce-bebe"
                titulo="Nueva Venta"
                abierto={modalAbierto}
                onCerrar={() => setModalAbierto(false)}
            >
                <AgenteTpv
                    nombre="agente_tpv"
                    label="Agente"
                    valor={agenteId}
                    onChange={(opcion) => setAgenteId(opcion?.valor ?? "")}
                />
                <QBoton
                    onClick={confirmar}
                    deshabilitado={!agenteId}
                >
                    Crear Venta
                </QBoton>
            </QModal>
        </>
    );
};
