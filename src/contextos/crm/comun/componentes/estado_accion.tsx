import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { opcionesEstadoAccion } from "../valores/estado_accion.ts";

interface EstadoAccionProps {
  valor: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  getProps?: (campo: string) => Record<string, unknown>;
}

export const EstadoAccion = ({
  valor,
  onChange,
  getProps,
}: EstadoAccionProps) => {
  return (
    <QSelect
      label="Estado"
      nombre="estado"
      valor={valor}
      onChange={onChange}
      opciones={opcionesEstadoAccion}
      {...(getProps ? getProps("estado") : {})}
    />
  );
};
