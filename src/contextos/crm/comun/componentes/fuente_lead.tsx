import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { opcionesFuenteLead } from "../valores/fuente_lead.ts";

interface FuenteLeadProps {
  valor: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  getProps?: (campo: string) => Record<string, unknown>;
}

export const FuenteLead = ({ valor, onChange, getProps }: FuenteLeadProps) => {
  return (
    <QSelect
      label="Fuente"
      nombre="fuente_id"
      valor={valor}
      onChange={onChange}
      opciones={opcionesFuenteLead}
      {...(getProps ? getProps("tipo") : {})}
    />
  );
};
