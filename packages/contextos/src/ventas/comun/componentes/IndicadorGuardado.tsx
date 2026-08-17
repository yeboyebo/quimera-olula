import { useEffect, useRef, useState } from "react";
import "./IndicadorGuardado.css";

export const IndicadorGuardado = ({
  modificado,
  msVisible = 1500,
}: {
  modificado: boolean;
  msVisible?: number;
}) => {
  const [guardadoReciente, setGuardadoReciente] = useState(false);
  const modificadoPrevio = useRef(modificado);

  useEffect(() => {
    const seAcabaDeGuardar = modificadoPrevio.current && !modificado;
    modificadoPrevio.current = modificado;

    if (!seAcabaDeGuardar) return;

    setGuardadoReciente(true);
    const temporizador = setTimeout(() => setGuardadoReciente(false), msVisible);
    return () => clearTimeout(temporizador);
  }, [modificado, msVisible]);

  if (modificado) {
    return (
      <span className="indicador-guardado pendiente" role="status">
        Sin guardar
      </span>
    );
  }

  if (guardadoReciente) {
    return (
      <span className="indicador-guardado guardado" role="status">
        Guardado
      </span>
    );
  }

  return null;
};
