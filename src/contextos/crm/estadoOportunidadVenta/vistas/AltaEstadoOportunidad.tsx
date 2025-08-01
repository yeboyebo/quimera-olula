import { useContext } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import {
  metaNuevoEstadoOportunidad,
  nuevoEstadoOportunidadVacio,
} from "../dominio.ts";
import {
  getEstadoOportunidad,
  postEstadoOportunidad,
} from "../infraestructura.ts";
import "./AltaEstadoOportunidad.css";

export const AltaEstadoOportunidad = ({
  emitir = () => {},
}: {
  emitir?: EmitirEvento;
}) => {
  const estadoOportunidad = useModelo(
    metaNuevoEstadoOportunidad,
    nuevoEstadoOportunidadVacio
  );
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const id = await intentar(() =>
      postEstadoOportunidad(estadoOportunidad.modelo)
    );
    const estadoCreado = await getEstadoOportunidad(id);
    emitir("ESTADO_OPORTUNIDAD_CREADO", estadoCreado);
  };

  return (
    <div className="AltaEstadoOportunidad">
      <h2>Nuevo Estado de Oportunidad</h2>
      <quimera-formulario>
        <QInput
          label="Descripción"
          {...estadoOportunidad.uiProps("descripcion")}
        />
        <QInput
          label="Probabilidad (%)"
          {...estadoOportunidad.uiProps("probabilidad")}
        />
        <QInput
          label="Valor por Defecto"
          {...estadoOportunidad.uiProps("valor_defecto")}
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!estadoOportunidad.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={() => emitir("ALTA_CANCELADA")} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
