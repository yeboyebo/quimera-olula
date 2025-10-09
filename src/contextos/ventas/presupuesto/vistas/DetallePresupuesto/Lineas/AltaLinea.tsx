import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { useModelo } from "../../../../../comun/useModelo.ts";
import { Articulo } from "../../../../comun/componentes/articulo.tsx";
import { metaNuevaLinea, nuevaLineaVacia } from "../../../dominio.ts";
import "./AltaLinea.css";

export const AltaLinea = ({
  emitir,
}: {
  emitir: (evento: string, payload: unknown) => void;
}) => {
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaLinea,
    nuevaLineaVacia()
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
          onClick={() => emitir("alta_lista", modelo)}
          deshabilitado={!valido}
        >
          Guardar
        </QBoton>
      </div>
    </div>
  );
};
