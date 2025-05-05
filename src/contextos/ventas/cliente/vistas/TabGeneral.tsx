import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QDate } from "../../../../componentes/atomos/qdate.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QTextArea } from "../../../../componentes/atomos/qtextarea.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { HookModelo } from "../../../comun/useModelo.ts";
import { TipoIdFiscal } from "../../comun/componentes/tipoIdFiscal.tsx";
import { Cliente } from "../diseño.ts";
import { BajaCliente } from "./BajaCliente.tsx";
import "./TabGeneral.css";

interface TabGeneralProps {
  // getProps: (campo: string) => Record<string, unknown>;
  // setCampo: (campo: string) => (valor: unknown) => void;
  // dispatch: (action: Accion<Cliente>) => void;
  cliente: HookModelo<Cliente>;
  onEntidadActualizada: (entidad: Cliente) => void;
  recargarCliente: () => void;
}

export const TabGeneral = ({
  // getProps,
  // setCampo,
  // dispatch,
  cliente,
  recargarCliente,
}: TabGeneralProps) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const onCancelar = () => {
    setMostrarModal(false);
  };

  const { uiProps } = cliente;

  

  const onDarDeBajaClicked = async () => {
    setMostrarModal(true);
  };

  const onBajaRealizada = async () => {
    setMostrarModal(false);
    recargarCliente();
  };

  return (
    <>
      <quimera-formulario>
        <QInput
          label="Nombre"
          {...uiProps('nombre')}
        />
        <QInput
          label="Nombre Comercial"
          {...uiProps('nombre_comercial')}
        />
        <TipoIdFiscal
          {...uiProps('tipo_id_fiscal')}
        />
        <QInput
          label="Id Fiscal"
          {...uiProps('id_fiscal')}
        />
        <QInput
          label="Teléfono 1"
          {...uiProps('telefono1')}
        />
        <QInput
          label="Teléfono 2"
          {...uiProps('telefono2')}
        />
        <QInput
          label="Email"
          {...uiProps('email')}
        />
        <QInput
          label="Web"
          {...uiProps('web')}
        />
        <QTextArea
          label="Observaciones"
          {...uiProps('observaciones')}
        />
        {cliente.modelo.de_baja ? (
          <QDate
            label="Fecha Baja"
            {...uiProps('fecha_baja')}
          />
        ) : (
          <QBoton onClick={onDarDeBajaClicked}>Dar de baja</QBoton>
        )}
      </quimera-formulario>
      <QModal nombre="modal" abierto={mostrarModal} onCerrar={onCancelar}>
        <h2>Dar de baja</h2>
        <BajaCliente cliente={cliente} onBajaRealizada={onBajaRealizada} />
      </QModal>
    </>
  );
};
