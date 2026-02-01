import { ContextoError } from "@olula/lib/contexto.js";
import { useContext, useState } from "react";
import { QBoton } from "../atomos/qboton.tsx";
import { QModal } from "./qmodal.tsx";

interface QModalConfirmacionProps {
  nombre: string;
  abierto: boolean;
  titulo: string;
  mensaje?: string;
  onCerrar: () => void;
  onAceptar: () => void | Promise<void>;
  labelAceptar?: string;
  labelCancelar?: string;
}

export const QModalConfirmacion = ({
  nombre,
  abierto,
  titulo,
  mensaje,
  onCerrar,
  onAceptar,
  labelAceptar = "Aceptar",
  labelCancelar = "Cancelar",
}: QModalConfirmacionProps) => {

    const [aceptado, setAceptado] = useState(false) 

    const { intentar } = useContext(ContextoError);

    const aceptar = async () => {
        await intentar(
            async () => {
                setAceptado(true)
                await onAceptar()
            },
            () => setAceptado(false)
        )
    }
    
    const cancelar = () => {
        console.log('cancelando', aceptado)
        if (!aceptado) onCerrar()
    }

    return (
        <QModal nombre={nombre} abierto={abierto} onCerrar={cancelar}>
        <h2>{titulo}</h2>
        <div className="mensaje">{mensaje}</div>
        <div className="botones">
            <QBoton tipo="reset" variante="texto" onClick={cancelar}>
            {labelCancelar}
            </QBoton>
            <QBoton onClick={aceptar}>{labelAceptar}</QBoton>
        </div>
        </QModal>
    );
};
