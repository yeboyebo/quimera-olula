import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { metaNuevaAccion, nuevaAccionVacia } from "../dominio.ts";
import { getAccion, postAccion } from "../infraestructura.ts";
import "./AltaAccion.css";

export const AltaAccion = ({
  emitir = () => {},
}: {
  emitir?: EmitirEvento;
}) => {
  const nuevaAccion = useModelo(metaNuevaAccion, nuevaAccionVacia);

  const guardar = async () => {
    const id = await postAccion(nuevaAccion.modelo);
    const accionCreada = await getAccion(id);
    emitir("ACCION_CREADA", accionCreada);
  };

  return (
    <div className="AltaAccion">
      <h2>Nueva Acción</h2>
      <quimera-formulario>
        <QInput label="Descripción" {...nuevaAccion.uiProps("descripcion")} />
        <QInput label="Fecha" {...nuevaAccion.uiProps("fecha")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevaAccion.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={() => emitir("ALTA_CANCELADA")} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
