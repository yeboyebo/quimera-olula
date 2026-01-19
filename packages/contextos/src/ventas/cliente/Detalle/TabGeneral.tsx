import { TipoIdFiscal } from "#/ventas/comun/componentes/tipoIdFiscal.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { EmitirEvento, EventoMaquina } from "@olula/lib/diseño.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Cliente, EstadoCliente } from "../diseño.ts";
import "./TabGeneral.css";

type ClienteConEstado = HookModelo<Cliente> & {
  estado: EstadoCliente;
  emitir: (evento: string, payload?: unknown) => Promise<EventoMaquina[]>;
};

interface TabGeneralProps {
  cliente: ClienteConEstado;
  emitirCliente: EmitirEvento;
  recargarCliente: () => void;
}

export const TabGeneral = ({ cliente, emitirCliente }: TabGeneralProps) => {
  const { uiProps } = cliente;

  const onDarDeBajaClicked = async () => {
    emitirCliente("baja_solicitada");
  };

  const onDarAltaClicked = async () => {
    emitirCliente("dar_de_alta_solicitado");
  };

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
        {cliente.modelo.de_baja ? (
          <>
            <QDate label="Fecha Baja" {...uiProps("fecha_baja")} />
            <QBoton onClick={onDarAltaClicked}>Dar de alta</QBoton>
          </>
        ) : (
          <QBoton onClick={onDarDeBajaClicked}>Dar de baja</QBoton>
        )}
      </quimera-formulario>
    </div>
  );
};
