import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Pedido } from "../diseño.ts";
import "./TabObservaciones.css";

interface TabClienteProps {
  pedido: HookModelo<Pedido>;
}

export const TabObservaciones = ({ pedido }: TabClienteProps) => {
  const { uiProps } = pedido;

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
