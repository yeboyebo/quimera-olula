import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { EstadoObjetoValor } from "../../../comun/dominio.ts";
import { Clientes } from "../../comun/componentes/cliente.tsx";
import { Direcciones } from "../../comun/componentes/dirCliente.tsx";
import { Presupuesto } from "../diseño.ts";

interface TabClienteProps {
  getProps: (campo: string) => Record<string, unknown>;
  setCampo: (campo: string) => (valor: unknown) => void;
  presupuesto: EstadoObjetoValor<Presupuesto>;
  onEntidadActualizada: (entidad: Presupuesto) => void;
}

export const TabCliente = ({
  getProps,
  setCampo,
  presupuesto,
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

  return (
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
  );
};
