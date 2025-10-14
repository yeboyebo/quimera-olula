import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Mostrar } from "@olula/componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
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
  activo = false,
}: {
  emitir?: EmitirEvento;
  activo?: boolean;
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
    emitir("estado_oportunidad_creado", estadoCreado);
    estadoOportunidad.init();
  };

  const cancelar = () => {
    emitir("creacion_cancelada");
    estadoOportunidad.init();
  };

  return (
    <Mostrar modo="modal" activo={!!activo} onCerrar={cancelar}>
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
          <QBoton onClick={cancelar} variante="texto">
            Cancelar
          </QBoton>
        </div>
      </div>
    </Mostrar>
  );
};
