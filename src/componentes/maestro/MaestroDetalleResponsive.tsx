import { ReactNode } from "react";

export function MaestroDetalleResponsive({
  seleccionada,
  Maestro,
  Detalle,
}: {
  seleccionada: unknown;
  Maestro: ReactNode;
  Detalle: ReactNode;
}) {
  const esMovil = window.matchMedia("(max-width: 768px)").matches;

  return (
    <maestro-detalle>
      {(!esMovil || !seleccionada) && <div className="Maestro">{Maestro}</div>}
      {(!esMovil || seleccionada) && <div className="Detalle">{Detalle}</div>}
    </maestro-detalle>
  );
}
