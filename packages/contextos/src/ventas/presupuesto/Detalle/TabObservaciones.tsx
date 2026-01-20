import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Presupuesto } from "./diseño.ts";
import "./TabObservaciones.css";

interface TabObservacionesProps {
  presupuesto: HookModelo<Presupuesto>;
}

export const TabObservaciones = ({ presupuesto }: TabObservacionesProps) => {
  const { uiProps } = presupuesto;

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
