import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { opcionesTipoIdFiscal } from "../../../valores/idfiscal.ts";

interface IdFiscalProps {
  valor: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  getProps?: (campo: string) => Record<string, unknown>;
}

export const TipoIdFiscal = ({ valor, onChange, getProps }: IdFiscalProps) => {
  return (
    <QSelect
      label="Tipo Id Fiscal"
      nombre="tipo_id_fiscal"
      valor={valor}
      onChange={onChange}
      opciones={opcionesTipoIdFiscal}
      {...(getProps ? getProps("tipo_id_fiscal") : {})}
    />
  );
};
