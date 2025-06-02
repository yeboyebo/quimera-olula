import { QTextArea } from "../../../../../componentes/atomos/qtextarea.tsx";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Factura } from "../../diseño.ts";
import "./TabObservaciones.css";

interface TabClienteProps {
  factura: HookModelo<Factura>;
}

export const TabObservaciones = ({ factura }: TabClienteProps) => {
  const { uiProps } = factura;

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
