import { useReducer } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import {
  campoModeloAInput,
  initEstadoModelo,
  makeReductor,
  modeloEsValido,
} from "../../../comun/dominio.ts";
import { Cliente } from "../../comun/componentes/cliente.tsx";
import { DirCliente } from "../../comun/componentes/dirCliente.tsx";
import { Presupuesto } from "../diseño.ts";
import { metaNuevoPresupuesto, presupuestoNuevoVacio } from "../dominio.ts";
import { getPresupuesto, postPresupuesto } from "../infraestructura.ts";

export const AltaPresupuesto = ({
  onPresupuestoCreado = () => {},
  onCancelar,
}: {
  onPresupuestoCreado?: (presupuesto: Presupuesto) => void;
  onCancelar: () => void;
}) => {
  const [estado, dispatch] = useReducer(
    makeReductor(metaNuevoPresupuesto),
    initEstadoModelo(presupuestoNuevoVacio(), metaNuevoPresupuesto)
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
    const id = await postPresupuesto(estado.valor);
    const presupuestoCreado = await getPresupuesto(id);
    onPresupuestoCreado(presupuestoCreado);
  };

  const onClienteChanged = async (
    clienteId: {
      valor: string;
      descripcion: string;
    } | null
  ) => {
    if (!clienteId) return;
    setCampo("cliente_id")(clienteId.valor);
  };

  return (
    <>
      <h2>Nuevo Presupuesto</h2>
      <quimera-formulario>
        <Cliente
          valor={estado.valor.cliente_id}
          onChange={onClienteChanged}
        />
        <DirCliente
          clienteId={estado.valor.cliente_id}
          valor={estado.valor.direccion_id}
          onChange={(opcion) =>
            setCampo("direccion_id")(opcion?.valor || "")
          }
        />
        <QInput
          label="Empresa"
          onChange={setCampo("empresa_id")}
          {...getProps("empresa_id")}
        />
      </quimera-formulario>
      <div className="botones">
        <QBoton
          onClick={guardar}
          deshabilitado={!modeloEsValido(estado)}
        >
          Guardar
        </QBoton>
        <QBoton onClick={onCancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </>
  );
};
