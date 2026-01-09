import { ReactElement } from "react";

interface ColumnaEstadoTablaProps {
  estados: Record<string, ReactElement>;
  estadoActual: string;
}

export const ColumnaEstadoTabla = ({
  estados,
  estadoActual,
}: ColumnaEstadoTablaProps) => {
  return <>{estados[estadoActual]}</>;
};
