import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";
import {
  metaNuevaLineaAlbaran,
  nuevaLineaAlbaranVacia,
} from "../../../dominio.ts";
import "./AltaLinea.css";

export const AltaLinea = ({
  emitir,
}: {
  emitir: (evento: string, payload: unknown) => void;
}) => {
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaLineaAlbaran,
    nuevaLineaAlbaranVacia
  );

  return (
    <div className="AltaLinea">
      <h2>Nueva línea</h2>
      <quimera-formulario>
        <Articulo {...uiProps("referencia", "descripcion")} />
        <QInput label="Cantidad" {...uiProps("cantidad")} />
      </quimera-formulario>
      <div className="botones maestro-botones ">
        <QBoton
          onClick={() => emitir("ALTA_LISTA", modelo)}
          deshabilitado={!valido}
        >
          Guardar
        </QBoton>
      </div>
    </div>
  );
};
