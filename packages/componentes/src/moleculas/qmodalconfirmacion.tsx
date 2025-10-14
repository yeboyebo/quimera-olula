import { QBoton } from "../atomos/qboton.tsx";
import { QModal } from "./qmodal.tsx";

interface QModalConfirmacionProps {
  nombre: string;
  abierto: boolean;
  titulo: string;
  mensaje?: string;
  onCerrar: () => void;
  onAceptar: () => void;
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
  return (
    <QModal nombre={nombre} abierto={abierto} onCerrar={onCerrar}>
      <h2>{titulo}</h2>
      <div className="mensaje">{mensaje}</div>
      <div className="botones">
        <QBoton onClick={onAceptar}>{labelAceptar}</QBoton>
        <QBoton tipo="reset" variante="texto" onClick={onCerrar}>
          {labelCancelar}
        </QBoton>
      </div>
    </QModal>
  );
};
