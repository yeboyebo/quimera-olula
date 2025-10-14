import { Usuario } from "#/comun/componentes/usuario.tsx";
import { EstadoIncidencia } from "#/crm/comun/componentes/EstadoIncidencia.tsx";
import { PrioridadIncidencia } from "#/crm/comun/componentes/PrioridadIncidencia.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { Mostrar } from "@olula/componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { NuevaIncidencia } from "../diseño.ts";
import { metaNuevaIncidencia, nuevaIncidenciaVacia } from "../dominio.ts";
import { getIncidencia, postIncidencia } from "../infraestructura.ts";
import "./CrearIncidencia.css";

export const CrearIncidencia = ({
  publicar = () => {},
  activo = false,
}: {
  publicar?: EmitirEvento;
  activo: boolean;
}) => {
  const incidencia = useModelo(metaNuevaIncidencia, {
    ...nuevaIncidenciaVacia,
  });

  const cancelar = () => {
    incidencia.init();
    publicar("creacion_cancelada");
  };

  return (
    <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
      <FormAltaIncidencia publicar={publicar} incidencia={incidencia} />
    </Mostrar>
  );
};

const FormAltaIncidencia = ({
  publicar = () => {},
  incidencia,
}: {
  publicar?: EmitirEvento;
  incidencia: HookModelo<NuevaIncidencia>;
}) => {
  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    const modelo = {
      ...incidencia.modelo,
    };
    const id = await intentar(() => postIncidencia(modelo));
    const incidenciaCreada = await getIncidencia(id);
    publicar("incidencia_creada", incidenciaCreada);
    incidencia.init();
  };

  const cancelar = () => {
    publicar("creacion_cancelada");
    incidencia.init();
  };

  return (
    <div className="CrearIncidencia">
      <h2>Nueva Incidencia</h2>
      <quimera-formulario>
        <QInput label="Descripción" {...incidencia.uiProps("descripcion")} />
        <QInput label="Nombre" {...incidencia.uiProps("nombre")} />
        <QDate label="Fecha" {...incidencia.uiProps("fecha")} />
        <PrioridadIncidencia {...incidencia.uiProps("prioridad")} />
        <EstadoIncidencia {...incidencia.uiProps("estado")} />
        <Usuario
          {...incidencia.uiProps("responsable_id")}
          label="Responsable"
        />
        <QTextArea
          label="Descripción larga"
          rows={5}
          {...incidencia.uiProps("descripcion_larga")}
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={crear} deshabilitado={!incidencia.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
