import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { opcionesEstadoLead } from "../valores/estado_lead.ts";

interface EstadoLeadProps {
  valor: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  getProps?: (campo: string) => Record<string, unknown>;
}

export const EstadoLead = ({ valor, onChange, getProps }: EstadoLeadProps) => {
  return (
    <QSelect
      label="Estado"
      nombre="estado_id"
      valor={valor}
      onChange={onChange}
      opciones={opcionesEstadoLead}
      {...(getProps ? getProps("tipo") : {})}
    />
  );
};
