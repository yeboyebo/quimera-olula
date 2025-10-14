import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { opcionesTipoEntidadLead } from "../valores/tipo_entidad_lead.ts";

interface TipoEntidadLeadProps {
  valor: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  getProps?: (campo: string) => Record<string, unknown>;
}

export const TipoEntidadLead = ({
  valor,
  onChange,
  getProps,
}: TipoEntidadLeadProps) => {
  return (
    <QSelect
      label="Tipo Entidad"
      nombre="tipo"
      valor={valor}
      onChange={onChange}
      opciones={opcionesTipoEntidadLead}
      deshabilitado={true}
      {...(getProps ? getProps("tipo") : {})}
    />
  );
};
