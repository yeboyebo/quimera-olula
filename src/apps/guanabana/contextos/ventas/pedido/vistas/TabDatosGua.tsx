import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { HookModelo } from "../../../../../../contextos/comun/useModelo.ts";
import { Pedido } from "../../../../../../contextos/ventas/pedido/diseño.ts";
import { TabDatosBase } from "../../../../../../contextos/ventas/pedido/vistas/DetallePedido/TabDatosBase.tsx";

interface TabDatosProps {
  pedido: HookModelo<Pedido>; 
}

export const TabDatosGua = ({
  pedido,
}: TabDatosProps) => {

  const {uiProps} = pedido;

  return (
    <>
      <TabDatosBase pedido={pedido} />
      <quimera-formulario>
        <QInput
          label="Feria"
          {...uiProps("feria_id")}
        />
      </quimera-formulario>
    </>
  );
};
