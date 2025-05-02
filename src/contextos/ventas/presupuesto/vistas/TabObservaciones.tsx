import { QTextArea } from "../../../../componentes/atomos/qtextarea.tsx";
import { HookModelo } from "../../../comun/useModelo.ts";
import { Presupuesto } from "../diseño.ts";
import "./TabObservaciones.css";


interface TabClienteProps {
  ctxPresupuesto: HookModelo<Presupuesto>; 
  onEntidadActualizada: (entidad: Presupuesto) => void;
}

export const TabObservaciones = ({
  ctxPresupuesto,
  onEntidadActualizada,
}: TabClienteProps) => {

  const [_, uiProps] = ctxPresupuesto;

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
