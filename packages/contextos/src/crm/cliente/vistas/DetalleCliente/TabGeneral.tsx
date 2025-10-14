import { TipoIdFiscal } from "#/ventas/comun/componentes/tipoIdFiscal.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Cliente } from "../../diseño.ts";
import "./TabGeneral.css";

interface TabGeneralProps {
  cliente: HookModelo<Cliente>;
  emitir: EmitirEvento;
  recargarCliente: () => void;
}

export const TabGeneral = ({ cliente }: TabGeneralProps) => {
  const { uiProps } = cliente;

  return (
    <div className="TabGeneral">
      <quimera-formulario>
        <QInput label="Nombre" {...uiProps("nombre")} />
        <QInput label="Nombre Comercial" {...uiProps("nombre_comercial")} />
        <TipoIdFiscal {...uiProps("tipo_id_fiscal")} />
        <QInput label="Id Fiscal" {...uiProps("id_fiscal")} />
        <QInput label="Teléfono 1" {...uiProps("telefono1")} />
        <QInput label="Teléfono 2" {...uiProps("telefono2")} />
        <QInput label="Email" {...uiProps("email")} />
        <QInput label="Web" {...uiProps("web")} />
        <QTextArea label="Observaciones" {...uiProps("observaciones")} />
      </quimera-formulario>
    </div>
  );
};
