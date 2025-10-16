import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";
import { NuevaLineaPedido } from "../../../diseño.ts";
import {
  metaNuevaLineaPedido,
  nuevaLineaPedidoVacia,
} from "../../../dominio.ts";

import "./AltaLinea.css";

export const AltaLinea = ({
  guardar,
}: {
  guardar: (payload: NuevaLineaPedido) => void;
  emitir: (evento: string, payload?: unknown) => void;
}) => {
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaLineaPedido,
    nuevaLineaPedidoVacia
  );

  return (
    <div className="AltaLinea">
      <h2>Nueva línea</h2>
      <quimera-formulario>
        <Articulo
          {...uiProps("referencia", "descripcion")}
          nombre="referencia_nueva_linea_pedido"
        />
        <QInput label="Cantidad" {...uiProps("cantidad")} />
      </quimera-formulario>
      <div className="botones maestro-botones ">
        <QBoton onClick={() => guardar(modelo)} deshabilitado={!valido}>
          Guardar
        </QBoton>
      </div>
    </div>
  );
};
