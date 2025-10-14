import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Accion } from "../../diseño.ts";
// import "./TabObservaciones.css";

export const TabObservaciones = ({
  oportunidad,
}: {
  oportunidad: HookModelo<Accion>;
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
