import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { useModelo } from "../../../comun/useModelo.ts";
import { DirCliente } from "../diseño.ts";
import { metaNuevaDireccion, nuevaDireccionVacia } from "../dominio.ts";
import { getDireccion, postDireccion } from "../infraestructura.ts";

export const AltaDireccion = ({
  clienteId,
  onDireccionCreada = () => {},
}: {
  clienteId: string;
  onDireccionCreada?: (direccion: DirCliente) => void;
  onCancelar: () => void;
}) => {

  const nuevaDireccion = useModelo(
    metaNuevaDireccion,
    nuevaDireccionVacia
  );

  const { uiProps } = nuevaDireccion;

  const guardar = async () => {
    const id = await postDireccion(clienteId, nuevaDireccion.modelo);
    const direccionCreada = await getDireccion(clienteId, id);
    onDireccionCreada(direccionCreada);
  };

  return (
    <>
      <h2>Nueva dirección</h2>
      <quimera-formulario>
        <QInput
          label="Tipo de Vía"
          {...uiProps("tipo_via")}
        />
        <QInput
          label="Nombre de la Vía"
          {...uiProps("nombre_via")}
        />
        <QInput
          label="Ciudad"
          {...uiProps("ciudad")}
        />
      </quimera-formulario>
      <div className="botones maestro-botones ">
        <QBoton
          onClick={guardar}
          deshabilitado={!nuevaDireccion.valido}
        >
          Guardar
        </QBoton>
      </div>
    </>
  );
};
