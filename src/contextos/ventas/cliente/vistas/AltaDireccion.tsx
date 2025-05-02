import { useReducer } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import {
    campoModeloAInput,
    initEstadoModelo,
    makeReductor,
    modeloEsValido,
} from "../../../comun/dominio.ts";
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
  const [estado, dispatch] = useReducer(
    makeReductor(metaNuevaDireccion),
    initEstadoModelo(nuevaDireccionVacia, metaNuevaDireccion)
  );

  const setCampo = (campo: string) => (valor: string) => {
    dispatch({
      type: "set_campo",
      payload: { campo, valor },
    });
  };

  const getProps = (campo: string) => {
    return campoModeloAInput(estado, campo);
  };

  const guardar = async () => {
    const id = await postDireccion(clienteId, estado.valor);
    const direccionCreada = await getDireccion(clienteId, id);
    onDireccionCreada(direccionCreada);
  };

  return (
    <>
      <h2>Nueva Dirección</h2>
      <section>
        <QInput
          label="Tipo de Vía"
          onChange={setCampo("tipo_via")}
          {...getProps("tipo_via")}
        />
        <QInput
          label="Nombre de la Vía"
          onChange={setCampo("nombre_via")}
          {...getProps("nombre_via")}
        />
        <QInput
          label="Ciudad"
          onChange={setCampo("ciudad")}
          {...getProps("ciudad")}
        />
      </section>
      <section>
        <QBoton
          onClick={guardar}
          deshabilitado={!modeloEsValido(estado)}
        >
          Guardar
        </QBoton>
      </section>
    </>
  );
};
