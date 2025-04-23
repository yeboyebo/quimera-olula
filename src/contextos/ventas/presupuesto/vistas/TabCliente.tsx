import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import {
  Accion,
  entidadModificada,
  EstadoObjetoValor,
  puedoGuardarObjetoValor,
} from "../../../comun/dominio.ts";
import { Clientes } from "../../comun/componentes/cliente.tsx";
import { Direcciones } from "../../comun/componentes/dirCliente.tsx";
import { Presupuesto } from "../diseño.ts";
import { getPresupuesto, patchPresupuesto } from "../infraestructura.ts";

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

  const onDireccionChanged = (
    opcion: { valor: string; descripcion: string } | null
  ) => {
    setCampo("direccion_id")(opcion?.valor);
  };

  const onGuardarClicked = async () => {
    await patchPresupuesto(presupuesto.valor.id, presupuesto.valor);
    const presupuesto_guardado = await getPresupuesto(presupuesto.valor.id);
    dispatch({ type: "init", payload: { entidad: presupuesto_guardado } });
    onEntidadActualizada(presupuesto.valor);
  };

  return (
    <>
      <quimera-formulario>
        <Clientes
          cliente_id={presupuesto.valor.cliente_id}
          descripcion={presupuesto.valor.nombre_cliente}
          onClienteChanged={onClienteChanged}
        />
        <Direcciones
          clienteId={presupuesto.valor.cliente_id}
          direccion_id={presupuesto.valor.direccion_id}
          onDireccionChanged={onDireccionChanged}
        />
        <QInput
          label="ID Fiscal"
          nombre="id_fiscal"
          onChange={setCampo("id_fiscal")}
          {...getProps("id_fiscal")}
        />
      </quimera-formulario>
      <div className="botones">
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
    </>
  );
};
