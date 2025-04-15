import { useReducer, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "../../../comun/diseño.ts";
import {
  campoObjetoValorAInput,
  initEstadoObjetoValor,
  makeReductor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
import { getClientes, getDirecciones } from "../../cliente/infraestructura.ts";
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
    initEstadoObjetoValor(presupuestoNuevoVacio(), metaNuevoPresupuesto)
  );

  const [opcionesDireccion, setOpcionesDireccion] = useState<
    { valor: string; descripcion: string }[]
  >([]);

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

  const obtenerOpcionesCliente = async (valor: string) => {
    const criteria = {
      filtro: {
        nombre: {
          LIKE: valor,
        },
      },
      orden: { id: "DESC" },
    };
    const clientes = await getClientes(
      criteria.filtro as Filtro,
      criteria.orden as Orden
    );
    return clientes.map((cliente) => ({
      valor: cliente.id,
      descripcion: cliente.nombre,
    }));
  };

  const onClienteBlurred = async (
    clienteId: {
      valor: string;
      descripcion: string;
    } | null
  ) => {
    if (!clienteId) return;
    setCampo("cliente_id")(clienteId.valor);

    const direcciones = await getDirecciones(clienteId.valor);
    const opciones = direcciones.map((direccion) => ({
      valor: direccion.id,
      descripcion: `${direccion.tipo_via} ${direccion.nombre_via}, ${direccion.ciudad}`,
    }));
    setOpcionesDireccion(opciones);
  };

  return (
    <>
      <h2>Nuevo Presupuesto</h2>
      <quimera-formulario>
        <QAutocompletar
          label="Cliente"
          nombre="cliente_id"
          onBlur={onClienteBlurred}
          valor={estado.valor.cliente_id}
          obtenerOpciones={obtenerOpcionesCliente}
        />
        <QSelect
          label="Dirección"
          opciones={opcionesDireccion}
          onChange={setCampo("direccion_id")}
          {...getProps("direccion_id")}
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
          deshabilitado={!puedoGuardarObjetoValor(estado)}
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
