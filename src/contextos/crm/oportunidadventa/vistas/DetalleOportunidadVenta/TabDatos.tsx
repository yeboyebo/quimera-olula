import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { OportunidadVenta } from "../../diseño.ts";
// import "./TabDatos.css";

export const TabDatos = ({
  oportunidad,
}: {
  oportunidad: HookModelo<OportunidadVenta>;
}) => {
  const { uiProps } = oportunidad;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QInput label="Descripción" {...uiProps("descripcion")} />
        <QInput label="Cliente" {...uiProps("nombre_cliente")} deshabilitado />
        <QInput label="Total Venta" {...uiProps("total_venta")} />
        <QInput label="Estado" {...uiProps("nombre_estado")} deshabilitado />
        <QInput label="Probabilidad (%)" {...uiProps("probabilidad")} />
        <QInput label="Fecha Cierre" {...uiProps("fecha_cierre")} />
      </quimera-formulario>
    </div>
  );
};
