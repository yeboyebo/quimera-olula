import { QSelect } from "../../../../../src/componentes/atomos/qselect.tsx";
import { opciones } from "../valores/valores_componente.ts";

interface SeleccionProps {
  valor: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  getProps?: (campo: string) => Record<string, unknown>;
}

export const Seleccion = ({ valor, onChange, getProps }: SeleccionProps) => {
  return (
    <QSelect
      label="Tipo Acción"
      nombre="tipo"
      valor={valor}
      onChange={onChange}
      opciones={opciones}
      {...(getProps ? getProps("tipo") : {})}
    />
  );
};
