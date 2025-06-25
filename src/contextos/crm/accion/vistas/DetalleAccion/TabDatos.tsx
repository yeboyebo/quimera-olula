import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Accion } from "../../diseño.ts";

export const TabDatos = ({ accion }: { accion: HookModelo<Accion> }) => {
  const { uiProps } = accion;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QInput label="Estado" {...uiProps("estado")} />
        <QInput label="Observaciones" {...uiProps("observaciones")} />
        <QInput label="Agente" {...uiProps("agente_id")} />
        <QInput label="Tipo" {...uiProps("tipo")} />
        <QInput label="Cliente" {...uiProps("cliente_id")} />
        <QInput label="Contacto" {...uiProps("contacto_id")} />
        <QInput label="Oportunidad" {...uiProps("oportunidad_id")} />
        <QInput label="Tarjeta" {...uiProps("tarjeta_id")} />
        <QInput label="Incidencia" {...uiProps("incidencia_id")} />
        <QInput label="Proyecto" {...uiProps("proyecto_id")} />
        <QInput label="Subproyecto" {...uiProps("subproyecto_id")} />
        <QInput label="Usuario" {...uiProps("usuario_id")} />
        <QInput label="Fecha fin" {...uiProps("fecha_fin")} />
      </quimera-formulario>
    </div>
  );
};
