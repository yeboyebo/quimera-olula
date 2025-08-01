import { useContext } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
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
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const modelo = {
      ...nuevaAccion.modelo,
      usuario_id: "juanma",
    };
    const id = await intentar(() => postAccion(modelo));
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
