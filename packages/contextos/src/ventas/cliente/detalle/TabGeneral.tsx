import { TipoIdFiscal } from "#/ventas/comun/componentes/tipoIdFiscal.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { BajaCliente } from "../dar_de_baja/BajaCliente.tsx";
import { Cliente } from "../diseño.ts";
import "./TabGeneral.css";

interface TabGeneralProps {
  form: HookModelo<Cliente>;
  cliente: Cliente;
  emitirCliente: ProcesarEvento;
  recargarCliente: () => void;
  estado: string;
}

export const TabGeneral = ({
  form,
  cliente,
  emitirCliente,
  estado,
}: TabGeneralProps) => {
  const { uiProps } = form;

  const onDarDeBajaClicked = async () => {
    emitirCliente("baja_solicitada");
  };

  const onDarAltaClicked = async () => {
    emitirCliente("dar_de_alta_solicitado");
  };

  const onCancelarBaja = () => {
    emitirCliente("baja_cancelada");
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
        {cliente.de_baja ? (
          <>
            <QDate label="Fecha Baja" {...uiProps("fecha_baja")} />
            <QBoton onClick={onDarAltaClicked}>Dar de alta</QBoton>
          </>
        ) : (
          <QBoton onClick={onDarDeBajaClicked}>Dar de baja</QBoton>
        )}
      </quimera-formulario>

      <QModal
        nombre="modal"
        abierto={estado === "BAJANDO_CLIENTE"}
        onCerrar={onCancelarBaja}
      >
        <h2>Dar de baja</h2>
        <BajaCliente clienteId={cliente.id} publicar={emitirCliente} />
      </QModal>
    </div>
  );
};
