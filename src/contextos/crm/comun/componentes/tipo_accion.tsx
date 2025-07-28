import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { opcionesTipoAccion } from "../valores/tipo_accion.ts";

interface TipoAccionProps {
  valor: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  getProps?: (campo: string) => Record<string, unknown>;
}

export const TipoAccion = ({ valor, onChange, getProps }: TipoAccionProps) => {
  return (
    <QSelect
      label="Tipo Acción"
      nombre="tipo"
      valor={valor}
      onChange={onChange}
      opciones={opcionesTipoAccion}
      {...(getProps ? getProps("tipo") : {})}
    />
  );
};
