import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QDate } from "../../../../componentes/atomos/qdate.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import {
  Accion,
  entidadModificada,
  EstadoObjetoValor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
import { IdFiscal } from "../../comun/componentes/idfiscal.tsx";
import { Cliente } from "../diseño.ts";
import { getCliente, patchCliente } from "../infraestructura.ts";
import { BajaCliente } from "./BajaCliente.tsx";
import "./TabGeneral.css";

interface TabGeneralProps {
  getProps: (campo: string) => Record<string, unknown>;
  setCampo: (campo: string) => (valor: unknown) => void;
  cliente: EstadoObjetoValor<Cliente>;
  dispatch: (action: Accion<Cliente>) => void;
  onEntidadActualizada: (entidad: Cliente) => void;
  recargarCliente: () => void;
}

export const TabGeneral = ({
  getProps,
  setCampo,
  cliente,
  dispatch,
  onEntidadActualizada,
  recargarCliente,
}: TabGeneralProps) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const onCancelar = () => {
    setMostrarModal(false);
  };

  const onGuardarClicked = async () => {
    await patchCliente(cliente.valor.id, cliente.valor);
    const cliente_guardado = await getCliente(cliente.valor.id);
    dispatch({ type: "init", payload: { entidad: cliente_guardado } });
    onEntidadActualizada(cliente.valor);
  };

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
          nombre="nombre"
          label="Nombre"
          onChange={setCampo("nombre")}
          {...getProps("nombre")}
        />
        <QInput
          nombre="nombre_comercial"
          label="Nombre Comercial"
          onChange={setCampo("nombre_comercial")}
          {...getProps("nombre_comercial")}
        />
        <IdFiscal
          valor={cliente.valor.tipo_id_fiscal}
          onChange={(opcion) => setCampo("tipo_id_fiscal")(opcion?.valor ?? "")}
          getProps={getProps}
        />
        <QInput
          nombre="id_fiscal"
          label="Id Fiscal"
          onChange={setCampo("id_fiscal")}
          {...getProps("id_fiscal")}
        />
        <QInput
          nombre="telefono1"
          label="Teléfono 1"
          onChange={setCampo("telefono1")}
          {...getProps("telefono1")}
        />
        <QInput
          nombre="telefono2"
          label="Teléfono 2"
          onChange={setCampo("telefono2")}
          {...getProps("telefono2")}
        />
        <QInput
          nombre="email"
          label="Email"
          onChange={setCampo("email")}
          {...getProps("email")}
        />
        <QInput
          nombre="web"
          label="Web"
          onChange={setCampo("web")}
          {...getProps("web")}
        />
        <QInput
          nombre="observaciones"
          label="Observaciones"
          onChange={setCampo("observaciones")}
          {...getProps("observaciones")}
        />
        {cliente.valor.de_baja ? (
          <QDate
            nombre="fecha_baja"
            label="Fecha Baja"
            onChange={setCampo("fecha_baja")}
            {...getProps("fecha_baja")}
          />
        ) : (
          <QBoton onClick={onDarDeBajaClicked}>Dar de baja</QBoton>
        )}
      </quimera-formulario>
      <div className="botones maestro-botones ">
        <QBoton
          onClick={onGuardarClicked}
          deshabilitado={!puedoGuardarObjetoValor(cliente)}
        >
          Guardar
        </QBoton>
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => {
            dispatch({
              type: "init",
              payload: { entidad: cliente.valor_inicial },
            });
          }}
          deshabilitado={!entidadModificada(cliente)}
        >
          Cancelar
        </QBoton>
        <QModal nombre="modal" abierto={mostrarModal} onCerrar={onCancelar}>
          <h2>Dar de baja</h2>
          <BajaCliente cliente={cliente} onBajaRealizada={onBajaRealizada} />
        </QModal>
      </div>
    </>
  );
};
