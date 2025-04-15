import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { Accion, EstadoObjetoValor } from "../../../comun/dominio.ts";
import { Presupuesto } from "../diseño.ts";

interface TabClienteProps {
  getProps: (campo: string) => Record<string, unknown>;
  setCampo: (campo: string) => (valor: unknown) => void;
  presupuesto: EstadoObjetoValor<Presupuesto>;
  dispatch: (action: Accion<Presupuesto>) => void;
  onEntidadActualizada: (entidad: Presupuesto) => void;
}

export const TabCliente = ({ getProps, setCampo }: TabClienteProps) => {
  return (
    <quimera-formulario>
      <QInput
        label="Nombre Cliente"
        nombre="nombre_cliente"
        onChange={setCampo("nombre_cliente")}
        {...getProps("nombre_cliente")}
      />
      <QInput
        label="ID Fiscal"
        nombre="id_fiscal"
        onChange={setCampo("id_fiscal")}
        {...getProps("id_fiscal")}
      />
    </quimera-formulario>
  );
};
