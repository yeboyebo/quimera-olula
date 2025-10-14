import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";
import { metaNuevaDireccion, nuevaDireccionVacia } from "../../../dominio.ts";
import { getDireccion, postDireccion } from "../../../infraestructura.ts";

export const AltaDireccion = ({
  clienteId,
  emitir,
}: {
  clienteId: string;
  emitir: (evento: string, payload?: unknown) => void;
}) => {
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaDireccion,
    nuevaDireccionVacia
  );

  const guardar = async () => {
    const id = await postDireccion(clienteId, modelo);
    const direccionCreada = await getDireccion(clienteId, id);
    emitir("DIRECCION_CREADA", direccionCreada);
  };

  return (
    <div className="AltaDireccion">
      <quimera-formulario>
        <QInput label="Tipo de Vía" {...uiProps("tipo_via")} />
        <QInput label="Nombre de la Vía" {...uiProps("nombre_via")} />
        <QInput label="Ciudad" {...uiProps("ciudad")} />
      </quimera-formulario>
      <div className="botones maestro-botones">
        <QBoton onClick={guardar} deshabilitado={!valido}>
          Guardar
        </QBoton>
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => emitir("ALTA_CANCELADA")}
        >
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
