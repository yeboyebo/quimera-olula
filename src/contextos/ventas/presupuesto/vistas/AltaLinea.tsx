import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { modeloEsValido } from "../../../comun/dominio.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { metaNuevaLinea, nuevaLineaVacia } from "../dominio.ts";

export const AltaLinea = ({
  publicar,
}: {
  publicar: (evento: string, payload: unknown) => void;
}) => {

  const [linea, uiProps] = useModelo(
    metaNuevaLinea,
    nuevaLineaVacia()
  );

  return (
    <>
      <h2>Nueva línea</h2>
      <quimera-formulario>
        <QInput
          label='Referencia'
          {...uiProps("referencia")}
        />
        <QInput
          label='Cantidad'
          {...uiProps("cantidad")}
        />
      </quimera-formulario>
      <div className="botones maestro-botones ">
        <QBoton
          onClick={() => publicar('nueva_linea_lista', linea.valor)}
          deshabilitado={!modeloEsValido(linea)}
        >
          Guardar
        </QBoton>
      </div>
    </>
  );
};
