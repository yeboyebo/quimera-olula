import { useReducer } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QForm } from "../../../../componentes/atomos/qform.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import {
  campoObjetoValorAInput,
  initEstadoObjetoValor,
  makeReductor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
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
  // Reducer para manejar el estado del presupuesto
  const [estado, dispatch] = useReducer(
    makeReductor(metaNuevoPresupuesto),
    initEstadoObjetoValor(presupuestoNuevoVacio(), metaNuevoPresupuesto)
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
    const id = await postPresupuesto(estado.valor);
    const presupuestoCreado = await getPresupuesto(id);
    onPresupuestoCreado(presupuestoCreado);
  };

  const obtenerOpcionesCliente = async () => [
    { valor: "1", descripcion: "Antonio 1" },
    { valor: "2", descripcion: "Juanma 2" },
    { valor: "3", descripcion: "Pozu 3" },
  ];

  const onClienteChange = async (
    clienteId: string,
    evento: React.ChangeEvent<HTMLElement>
  ) => {
    console.log("Cliente cambiado", clienteId);
    console.log(evento);
    setCampo("cliente_id")(clienteId);
  };

  return (
    <>
      <h2>Nuevo Presupuesto</h2>
      <QForm onSubmit={guardar} onReset={onCancelar}>
        <section>
          <QAutocompletar
            label="Cliente"
            nombre="cliente_id"
            onChange={onClienteChange}
            onBlur={onClienteChange}
            valor={estado.valor.cliente_id}
            obtenerOpciones={obtenerOpcionesCliente}
          />
          <QInput
            label="Dirección"
            onChange={setCampo("direccion_id")}
            {...getProps("direccion_id")}
          />
          <QInput
            label="Empresa"
            onChange={setCampo("empresa_id")}
            {...getProps("empresa_id")}
          />
        </section>
        <section>
          <QBoton
            tipo="submit"
            deshabilitado={!puedoGuardarObjetoValor(estado)}
          >
            Guardar
          </QBoton>
          <QBoton tipo="reset" variante="texto">
            Cancelar
          </QBoton>
        </section>
      </QForm>
    </>
  );
};
