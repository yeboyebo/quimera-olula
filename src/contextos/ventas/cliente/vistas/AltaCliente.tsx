import { useReducer } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import {
  campoModeloAInput,
  initEstadoModelo,
  makeReductor,
  modeloEsValido,
} from "../../../comun/dominio.ts";
import { opcionesTipoIdFiscal } from "../../../valores/idfiscal.ts";
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
    initEstadoModelo(nuevoClienteVacio)
  );

  const setCampo = (campo: string) => (valor: string) => {
    dispatch({
      type: "set_campo",
      payload: { campo, valor },
    });
  };

  const getProps = (campo: string) => {
    return campoModeloAInput(estado, campo);
  };

  const guardar = async () => {
    const id = await postCliente(estado.valor);
    const clienteCreado = await getCliente(id);
    onClienteCreado(clienteCreado);
  };

  return (
    <>
      <h2>Nuevo Cliente</h2>
      <quimera-formulario>
        <QInput
          label="Nombre"
          onChange={setCampo("nombre")}
          {...getProps("nombre")}
        />
        <QSelect
          label="Tipo Id Fiscal"
          opciones={opcionesTipoIdFiscal}
          onChange={(opcion) => setCampo("tipo_id_fiscal")(opcion?.valor || "")}
          {...getProps("tipo_id_fiscal")}
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
          label="Agente"
          onChange={setCampo("agente_id")}
          {...getProps("agente_id")}
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton
          onClick={guardar}
          deshabilitado={!modeloEsValido(metaNuevoCliente)(estado.valor)}
        >
          Guardar
        </QBoton>
        <QBoton tipo="reset" variante="texto" onClick={onCancelar}>
          Cancelar
        </QBoton>
      </div>
    </>
  );
};
