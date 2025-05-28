import { ReactNode } from "react";
import { useEsMovil } from "./useEsMovil.ts";

export function MaestroDetalleResponsive<T>({
  seleccionada,
  Maestro,
  Detalle,
}: {
  seleccionada: T;
  Maestro: ReactNode;
  Detalle: ReactNode;
}) {
  const esMovil = useEsMovil();

  return (
    <maestro-detalle>
      {(!esMovil || !seleccionada) && <div className="Maestro">{Maestro}</div>}
      {(!esMovil || seleccionada) && <div className="Detalle">{Detalle}</div>}
    </maestro-detalle>
  );
}
