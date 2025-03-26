import { useState } from "react";
import {
  Input,
  InputSelect,
} from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Cliente, NuevoCliente } from "../diseño.ts";
import { validadoresCliente } from "../dominio.ts";
import { camposCliente, getCliente, postCliente } from "../infraestructura.ts";

export const AltaCliente = ({
  onClienteCreado = () => {},
  onCancelar,
}: {
  onClienteCreado?: (cliente: Cliente) => void;
  onCancelar: () => void;
}) => {
  const [_, setGuardando] = useState(false);
  const [cliente, setCliente] = useState<NuevoCliente>({
    nombre: "",
    id_fiscal: "",
    empresa_id: "1",
    tipo_id_fiscal: "",
    agente_id: "",
  });

  const onCambio = (campo: string, valor: string) => {
    const nuevoCliente = { ...cliente, [campo]: valor };
    setCliente(nuevoCliente);
  };

  const onGuardarClicked = async () => {
    setGuardando(true);
    const id = await postCliente(cliente);
    const nuevoCliente = await getCliente(id);
    setGuardando(false);
    onClienteCreado(nuevoCliente);
  };

  return (
    <>
      <h2>Nuevo Cliente</h2>
      <Input
        controlado
        key="nombre"
        campo={camposCliente.nombre}
        onCampoCambiado={onCambio}
        valorEntidad={cliente.nombre}
        validador={validadoresCliente.nombre}
      />
      <Input
        controlado
        key="id_fiscal"
        campo={camposCliente.id_fiscal}
        onCampoCambiado={onCambio}
        valorEntidad={cliente.id_fiscal}
        validador={validadoresCliente.id_fiscal}
      />
      <Input
        controlado
        key="empresa_id"
        campo={camposCliente.empresa_id}
        onCampoCambiado={onCambio}
        valorEntidad={cliente.empresa_id}
      />
      <InputSelect
        key="tipo_id_fiscal"
        campo={camposCliente.tipo_id_fiscal}
        valorEntidad={cliente.tipo_id_fiscal}
        onCampoCambiado={onCambio}
      />
      <Input
        controlado
        key="agente_id"
        campo={camposCliente.agente_id}
        onCampoCambiado={onCambio}
        valorEntidad={cliente.agente_id}
      />
      <button
        onClick={onGuardarClicked}
        disabled={!validadoresCliente.nuevoCliente(cliente)}
      >
        Guardar
      </button>
      <button onClick={onCancelar}>Cancelar</button>
    </>
  );
};
