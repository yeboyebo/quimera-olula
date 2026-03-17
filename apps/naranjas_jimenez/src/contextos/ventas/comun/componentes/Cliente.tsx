import { QSelect } from "@olula/componentes/index.js";
import { useEffect, useState } from "react";
import { getClientes } from "#/ventas/cliente/infraestructura.ts";

interface ClienteProps {
  valor: string;
  nombre?: string;
  label?: string;
  deshabilitado?: boolean;
  ref?: React.RefObject<HTMLInputElement | null>;
  onChange?: (opcion: { valor: string; descripcion: string } | null) => void;
}

type OpcionCliente = {
  valor: string;
  descripcion: string;
};

export const Cliente = ({
  valor,
  nombre = "cliente_id",
  label = "Cliente",
  onChange,
  ...props
}: ClienteProps) => {
  const [opcionesCliente, setOpcionesCliente] = useState<OpcionCliente[]>([]);

  useEffect(() => {
    const cargarOpcionesCliente = async () => {
      const { datos } = await getClientes([], [], { pagina: 1, limite: 1000 });
      setOpcionesCliente(datos.map((cliente) => ({ valor: cliente.id, descripcion: cliente.nombre })));
    };
    cargarOpcionesCliente();
  }, []);

  return (
    <QSelect
      label={label}
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opcionesCliente}
      {...props}
    />
  );
};
