import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";
import { DirCliente } from "../../diseño.ts";
import { metaDireccion } from "./dominio.ts";

export const EdicionDireccion = ({
  direccion,
  emitir,
}: {
  direccion: DirCliente;
  emitir: (evento: string, payload?: unknown) => void;
}) => {
  const direccionEditada = useModelo(metaDireccion, direccion);

  const guardar = async () => {
    emitir("actualizar_direccion", direccionEditada.modelo);
  };

  const opciones = [
    { valor: "Calle", descripcion: "Calle" },
    { valor: "Avenida", descripcion: "Avenida" },
    { valor: "Plaza", descripcion: "Plaza" },
    { valor: "Paseo", descripcion: "Paseo" },
    { valor: "Camino", descripcion: "Camino" },
    { valor: "Carretera", descripcion: "Carretera" },
  ];

  return (
    <div className="EdicionDireccion">
      <h2>Edición de dirección</h2>
      <quimera-formulario>
        <div style={{ gridColumn: "span 2" }}>
          <QSelect
            label="Tipo de Vía"
            opciones={opciones}
            {...direccionEditada.uiProps("tipo_via")}
          />
        </div>
        <div style={{ gridColumn: "span 10" }}>
          <QInput
            label="Nombre de la Vía"
            {...direccionEditada.uiProps("nombre_via")}
          />
        </div>
        <div style={{ gridColumn: "span 12" }}>
          <QInput label="Ciudad" {...direccionEditada.uiProps("ciudad")} />
        </div>
      </quimera-formulario>
      <div className="botones maestro-botones">
        <QBoton deshabilitado={!direccionEditada.valido} onClick={guardar}>
          Guardar
        </QBoton>
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => emitir("edicion_cancelada")}
        >
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
