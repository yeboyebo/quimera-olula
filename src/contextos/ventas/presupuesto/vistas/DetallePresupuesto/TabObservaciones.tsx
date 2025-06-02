import { QTextArea } from "../../../../../componentes/atomos/qtextarea.tsx";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Presupuesto } from "../../diseño.ts";
import "./TabObservaciones.css";

interface TabClienteProps {
  ctxPresupuesto: HookModelo<Presupuesto>;
}

export const TabObservaciones = ({ ctxPresupuesto }: TabClienteProps) => {
  const { uiProps } = ctxPresupuesto;

  return (
    <div className="TabObservaciones">
      <quimera-formulario>
        <QTextArea
          label="Observaciones"
          rows={5}
          {...uiProps("observaciones")}
        />
      </quimera-formulario>
    </div>
  );
};
