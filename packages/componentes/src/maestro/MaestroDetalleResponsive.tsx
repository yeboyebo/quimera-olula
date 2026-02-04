import { ReactNode, useEffect, useRef, useState } from "react";
import { QModal } from "../moleculas/qmodal.tsx";
import "./MaestroDetalleResponsive.css";
import { useEsMovil } from "./useEsMovil.ts";

type Modo = "tabla" | "tarjetas";

export function MaestroDetalleResponsive<T>({
  seleccionada,
  Maestro,
  Detalle,
  modo = "tabla",
  nombreModal = "detalle",
  onCerrarDetalle,
}: {
  seleccionada: T | null;
  Maestro: ReactNode;
  Detalle: ReactNode;
  modo?: Modo;
  nombreModal?: string;
  onCerrarDetalle?: () => void;
}) {
  const esMovil = useEsMovil();
  const [modalAbierto, setModalAbierto] = useState(false);
  const prevSeleccionada = useRef<T | null>(null);

  useEffect(() => {
    if (modo === "tarjetas") {
      if (seleccionada && seleccionada !== prevSeleccionada.current) {
        setModalAbierto(true);
      } else if (!seleccionada) {
        setModalAbierto(false);
      }
      prevSeleccionada.current = seleccionada;
    }
  }, [seleccionada, modo]);

  if (modo === "tarjetas") {
    return (
      <maestro-detalle tipo="tarjetas">
        <div className="Maestro">{Maestro}</div>
        <QModal
          nombre={nombreModal}
          abierto={modalAbierto}
          onCerrar={() => {
            setModalAbierto(false);
            if (onCerrarDetalle) {
              onCerrarDetalle();
            }
          }}
        >
          {Detalle}
        </QModal>
      </maestro-detalle>
    );
  }

  return (
    <maestro-detalle tipo="tabla">
      {(!esMovil || !seleccionada) && <div className="Maestro">{Maestro}</div>}
      {(!esMovil || seleccionada) && <div className="Detalle">{Detalle}</div>}
    </maestro-detalle>
  );
}
