import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Pedido } from "../diseño.ts";
import "./TabObservaciones.css";

interface TabClienteProps<T extends Pedido> {
  pedido: HookModelo<T>;
}

export const TabObservaciones = <T extends Pedido>({
  pedido,
}: TabClienteProps<T>) => {
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
