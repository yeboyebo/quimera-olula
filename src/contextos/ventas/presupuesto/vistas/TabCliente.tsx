import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import {
  Accion,
  entidadModificada,
  EstadoObjetoValor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
import { Cliente } from "../../comun/componentes/cliente.tsx";
import { Direcciones } from "../../comun/componentes/dirCliente.tsx";
import { Presupuesto, CambioCliente as TipoCambioCliente } from "../diseño.ts";
import { getPresupuesto, patchCambiarCliente, patchPresupuesto } from "../infraestructura.ts";
import { CambioCliente } from "./CambioCliente.tsx";
import "./TabCliente.css";

interface TabClienteProps {
  getProps: (campo: string) => Record<string, unknown>;
  setCampo: (campo: string) => (valor: unknown) => void;
  presupuesto: EstadoObjetoValor<Presupuesto>;
  onEntidadActualizada: (entidad: Presupuesto) => void;
  dispatch: (action: Accion<Presupuesto>) => void;
}

export const TabCliente = ({
  getProps,
  setCampo,
  presupuesto,
  onEntidadActualizada,
  dispatch,
}: TabClienteProps) => {

  const onClienteChanged = async (
    clienteId: {
      valor: string;
      descripcion: string;
    } | null
  ) => {
    if (!clienteId) return;
    setCampo("cliente_id")(clienteId.valor);
    setCampo("nombre_cliente")(clienteId.descripcion);
  };

  const [mostrarModalCambioCliente, setMostrarModalCambioCliente] = useState(false);

  // const onDireccionChanged = (
  //   opcion: { valor: string; descripcion: string } | null
  // ) => {
  //   setCampo("direccion_id")(opcion?.valor);
  // };

  const onGuardarClicked = async () => {
    await patchPresupuesto(presupuesto.valor.id, presupuesto.valor);
    const presupuesto_guardado = await getPresupuesto(presupuesto.valor.id);
    dispatch({ type: "init", payload: { entidad: presupuesto_guardado } });
    onEntidadActualizada(presupuesto.valor);
  };

  const cambiarCliente = async (nuevoCliente: TipoCambioCliente) => {
    setMostrarModalCambioCliente(false);
    await patchCambiarCliente(presupuesto.valor.id, 
      nuevoCliente.cliente_id,
      nuevoCliente.direccion_id);
    await refrescar();
  };

  const refrescar = async () => {
    const presupuesto_guardado = await getPresupuesto(presupuesto.valor.id);
    dispatch({ type: "init", payload: { entidad: presupuesto_guardado } });
    onEntidadActualizada(presupuesto.valor);
  }

  const onCambiarClienteClicked = async () => {
    setMostrarModalCambioCliente(true);
  };

  return (
    <>
      <quimera-formulario>
        <Cliente
          valor={presupuesto.valor.cliente_id}
          descripcion={presupuesto.valor.nombre_cliente}
          onClienteChanged={onClienteChanged}
        />
        {/* <label id='id_fiscal' >{`Id. Fiscal: ${presupuesto.valor.id_fiscal}`}</label> */}
        <QInput
          label="ID Fiscal"
          nombre="id_fiscal"
          onChange={setCampo("id_fiscal")}
          {...getProps("id_fiscal")}
        />
        <div id='cambiar_cliente' className="botones maestro-botones">
        <QBoton
          onClick={onCambiarClienteClicked}
        >C</QBoton>
        </div>
        <Direcciones
          clienteId={presupuesto.valor.cliente_id}
          direccion_id={presupuesto.valor.direccion_id}
          onDireccionChanged={setCampo("direccion_id")}
        />
      </quimera-formulario>
      <div className="botones maestro-botones">
        <QBoton
          onClick={onGuardarClicked}
          deshabilitado={!puedoGuardarObjetoValor(presupuesto)}
        >
          Guardar
        </QBoton>
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => {
            dispatch({
              type: "init",
              payload: { entidad: presupuesto.valor_inicial },
            });
          }}
          deshabilitado={!entidadModificada(presupuesto)}
        >
          Cancelar
        </QBoton>
      </div>
      <QModal nombre="modal" abierto={mostrarModalCambioCliente} onCerrar={() => setMostrarModalCambioCliente(false)}>
        <CambioCliente onListo={cambiarCliente} 
          />
      </QModal>
    </>
  );
};
