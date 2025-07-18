import { useState } from "react";
import { QDate } from "../../../../../../../componentes/atomos/qdate.tsx";
import { QInput } from "../../../../../../../componentes/atomos/qinput.tsx";
import { QTextArea } from "../../../../../../../componentes/atomos/qtextarea.tsx";
import { QModal } from "../../../../../../../componentes/moleculas/qmodal.tsx";
import { HookModelo } from "../../../../../../../contextos/comun/useModelo.ts";
import { Evento } from "../../diseño.ts";
import "./TabDatos.css";

interface TabDatosProps {
  evento: HookModelo<Evento>;
  // emitirEvento: EmitirEvento;
  recargarEvento: () => void;
}

export const TabDatos = ({ evento, recargarEvento }: TabDatosProps) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const onCancelar = () => {
    setMostrarModal(false);
  };

  const { uiProps } = evento;

  // const onDarDeBajaClicked = async () => {
  //   setMostrarModal(true);
  // };

  // const onDarAltaClicked = async () => {
  //   await darDeAltaEvento(evento.modelo.id);
  //   recargarEvento();
  // };

  // const onBajaRealizada = async () => {
  //   setMostrarModal(false);
  //   recargarEvento();
  // };

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QInput label="Nombre" {...uiProps("nombre")} />
        <QInput label="Nombre Comercial" {...uiProps("nombre_comercial")} />
        <QInput label="Id Fiscal" {...uiProps("id_fiscal")} />
        <QInput label="Teléfono 1" {...uiProps("telefono1")} />
        <QInput label="Teléfono 2" {...uiProps("telefono2")} />
        <QInput label="Email" {...uiProps("email")} />
        <QInput label="Web" {...uiProps("web")} />
        <QDate label="Fecha Baja" {...uiProps("fecha_baja")} />
        <QTextArea label="Observaciones" {...uiProps("observaciones")} />
        {/* {evento.modelo.de_baja ? (
          <>
            <QDate label="Fecha Baja" {...uiProps("fecha_baja")} />
            <QBoton onClick={onDarAltaClicked}>Dar de alta</QBoton>
          </>
        ) : (
          <QBoton onClick={onDarDeBajaClicked}>Dar de baja</QBoton>
        )} */}
      </quimera-formulario>
      <QModal nombre="modal" abierto={mostrarModal} onCerrar={onCancelar}>
        <h2>Dar de baja</h2>
        {/* <BajaEvento evento={evento} onBajaRealizada={onBajaRealizada} /> */}
      </QModal>
    </div>
  );
};
