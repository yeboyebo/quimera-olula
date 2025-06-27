import { QTextArea } from "../../../../../componentes/atomos/qtextarea.tsx";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Lead } from "../../diseño.ts";
// import "./TabObservaciones.css";

export const TabObservaciones = ({
  oportunidad,
}: {
  oportunidad: HookModelo<Lead>;
}) => {
  const { uiProps } = oportunidad;

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
