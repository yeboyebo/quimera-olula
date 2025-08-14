import { useContext } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QDate } from "../../../../componentes/atomos/qdate.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QTextArea } from "../../../../componentes/atomos/qtextarea.tsx";
import { Usuario } from "../../../comun/componentes/usuario.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { EstadoIncidencia } from "../../comun/componentes/EstadoIncidencia.tsx";
import { PrioridadIncidencia } from "../../comun/componentes/PrioridadIncidencia.tsx";
import { metaNuevaIncidencia, nuevaIncidenciaVacia } from "../dominio.ts";
import { getIncidencia, postIncidencia } from "../infraestructura.ts";
import "./AltaIncidencia.css";

export const AltaIncidencia = ({ emitir = () => {} }: { emitir?: EmitirEvento }) => {
  const nuevaIncidencia = useModelo(metaNuevaIncidencia, nuevaIncidenciaVacia);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const modelo = {
      ...nuevaIncidencia.modelo,
    };
    const id = await intentar(() => postIncidencia(modelo));
    const leadCreado = await getIncidencia(id);
    emitir("INCIDENCIA_CREADA", leadCreado);
  };

  return (
    <div className="AltaIncidencia">
      <h2>Nueva Incidencia</h2>
      <quimera-formulario>
        <QInput label="Descripción" {...nuevaIncidencia.uiProps("descripcion")} />
        <QInput label="Nombre" {...nuevaIncidencia.uiProps("nombre")} />
        <QDate label="Fecha" {...nuevaIncidencia.uiProps("fecha")} />
        <PrioridadIncidencia {...nuevaIncidencia.uiProps("prioridad")}/>
        <EstadoIncidencia {...nuevaIncidencia.uiProps("estado")}/>
        <Usuario {...nuevaIncidencia.uiProps("responsable_id")} label='Responsable'/>
        <QTextArea
          label="Descripción larga"
          rows={5}
          {...nuevaIncidencia.uiProps("descripcion_larga")}
        />
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
