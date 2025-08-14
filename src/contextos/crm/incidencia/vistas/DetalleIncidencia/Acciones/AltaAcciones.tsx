import { useContext } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { ContextoError } from "../../../../../comun/contexto.ts";
import { HookModelo, useModelo } from "../../../../../comun/useModelo.ts";
// import { EstadoIncidencia } from "../../../../comun/componentes/estado_incidencia.tsx";
// import { TipoIncidencia } from "../../../../comun/componentes/tipo_incidencia.tsx";
import { getIncidencia, postIncidencia } from "../../../../incidencia/infraestructura.ts";
import { Incidencia } from "../../../diseño.ts";
import { metaNuevaIncidencia, nuevaIncidenciaVacia } from "../../../dominio.ts";
import "./AltaIncidenciaes.css";

export const AltaIncidenciaes = ({
  emitir = () => {},
  lead,
}: {
  emitir?: (evento: string, payload?: unknown) => void;
  lead: HookModelo<Incidencia>;
}) => {
  const nuevaIncidencia = useModelo(metaNuevaIncidencia, nuevaIncidenciaVacia);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const modelo = {
      ...nuevaIncidencia.modelo,
      tarjeta_id: lead.modelo.id,
    };
    const id = await intentar(() => postIncidencia(modelo));
    const incidenciaCreada = await getIncidencia(id);
    emitir("ACCION_CREADA", incidenciaCreada);
  };

  return (
    <div className="AltaIncidenciaes">
      <h2>Nueva Acción</h2>
      <quimera-formulario>
        <QInput label="Descripción" {...nuevaIncidencia.uiProps("descripcion")} />
        <QInput label="Fecha" {...nuevaIncidencia.uiProps("fecha")} />
        {/* <EstadoIncidencia {...nuevaIncidencia.uiProps("estado")} />
        <TipoIncidencia {...nuevaIncidencia.uiProps("tipo")} /> */}
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevaIncidencia.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={() => emitir("ALTA_CANCELADA")} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
