import { useReducer } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import {
  campoObjetoValorAInput,
  initEstadoObjetoValor,
  makeReductor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
import { Cliente } from "../diseño.ts";
import { metaNuevoCliente, nuevoClienteVacio } from "../dominio.ts";
import { getCliente, postCliente } from "../infraestructura.ts";

export const AltaCliente = ({
  onClienteCreado = () => {},
  onCancelar,
}: {
  onClienteCreado?: (cliente: Cliente) => void;
  onCancelar: () => void;
}) => {
  const [estado, dispatch] = useReducer(
    makeReductor(metaNuevoCliente),
    initEstadoObjetoValor(nuevoClienteVacio, metaNuevoCliente)
  );

  const setCampo = (campo: string) => (valor: string) => {
    dispatch({
      type: "set_campo",
      payload: { campo, valor },
    });
  };

  const getProps = (campo: string) => {
    return campoObjetoValorAInput(estado, campo);
  };

  const guardar = async () => {
    const id = await postCliente(estado.valor);
    const clienteCreado = await getCliente(id);
    onClienteCreado(clienteCreado);
  };

  return (
    <>
      <h2>Nuevo Cliente</h2>
      <section>
        <QInput
          label="Nombre"
          onChange={setCampo("nombre")}
          {...getProps("nombre")}
        />
        <QInput
          label="ID Fiscal"
          onChange={setCampo("id_fiscal")}
          {...getProps("id_fiscal")}
        />
        <QInput
          label="Empresa"
          onChange={setCampo("empresa_id")}
          {...getProps("empresa_id")}
        />
        <QInput
          label="Tipo ID Fiscal"
          onChange={setCampo("tipo_id_fiscal")}
          {...getProps("tipo_id_fiscal")}
        />
        <QInput
          label="Agente"
          onChange={setCampo("agente_id")}
          {...getProps("agente_id")}
        />
      </section>
      <section>
        <QBoton
          onClick={guardar}
          deshabilitado={!puedoGuardarObjetoValor(estado)}
        >
          Guardar
        </QBoton>
        <QBoton tipo="reset" variante="texto" onClick={onCancelar}>
          Cancelar
        </QBoton>
      </section>
    </>
  );
};
