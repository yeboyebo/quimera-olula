import { QTextArea } from "../../../../../componentes/atomos/qtextarea.tsx";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Albaran } from "../../diseño.ts";
import "./TabObservaciones.css";

interface TabObservacionesProps {
  albaran: HookModelo<Albaran>;
}

export const TabObservaciones = ({ albaran }: TabObservacionesProps) => {
  const { uiProps } = albaran;

  return (
    <>
      <quimera-formulario>
        <QTextArea
          label="Observaciones"
          rows={5}
          {...uiProps("observaciones")}
        />
      </quimera-formulario>
    </>
  );
};
