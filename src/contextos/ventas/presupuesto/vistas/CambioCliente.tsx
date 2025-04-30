import { useReducer } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import {
  initEstadoObjetoValor,
  makeReductor,
  puedoGuardarObjetoValor
} from "../../../comun/dominio.ts";
import { Cliente } from "../../comun/componentes/cliente.tsx";
import { Direcciones } from "../../comun/componentes/dirCliente.tsx";
import { CambioCliente as TipoCambioCliente } from "../diseño.ts";
import { cambioClienteVacio, metaCambioCliente } from "../dominio.ts";
import "./CambioCliente.css";

export const CambioCliente = ({
  onListo,
}: {
  onListo: (cliente: TipoCambioCliente) => void;
}) => {

  const [cliente, dispatch] = useReducer(
    makeReductor(metaCambioCliente),
    initEstadoObjetoValor(cambioClienteVacio(), metaCambioCliente)
  );

  const setCampo = (campo: string) => (valor: string) => {
    dispatch({
      type: "set_campo",
      payload: { campo, valor },
    });
  };

  // const getProps = (campo: string) => {
  //   return campoObjetoValorAInput(cliente, campo);
  // };

  const guardar = async () => {
    onListo(cliente.valor);
    // const id = await postPresupuesto(cliente.valor);
    // const presupuestoCreado = await getPresupuesto(id);
    // onPresupuestoCreado(presupuestoCreado);
  };

  const onClienteChanged = async (
    clienteId: {
      valor: string;
      descripcion: string;
    } | null
  ) => {
    console.log("onClienteChanged", clienteId);
    setCampo("cliente_id")(clienteId ? clienteId.valor: '');
    setCampo("nombre_cliente")(clienteId ? clienteId.descripcion: '');
  };

  return (
    <>
      <h2>Cambiar cliente</h2>
      <quimera-formulario>
        <Cliente
          nombre='cambiar_cliente_presupuesto'
          cliente_id={cliente.valor.cliente_id}
          descripcion={cliente.valor.nombre_cliente}
          onClienteChanged={onClienteChanged}
        />
        <Direcciones
          clienteId={cliente.valor.cliente_id}
          direccion_id={cliente.valor.direccion_id}
          onDireccionChanged={(opcion) =>
            setCampo("direccion_id")(opcion?.valor || "")
          }
        />
      </quimera-formulario>
      <div className="botones maestro-botones ">
        <QBoton
          onClick={guardar}
          deshabilitado={!puedoGuardarObjetoValor(cliente)}
        >
          Guardar
        </QBoton>
        {/* <QBoton onClick={onCancelar} variante="texto">
          Cancelar
        </QBoton> */}
      </div>
    </>
  );
};
