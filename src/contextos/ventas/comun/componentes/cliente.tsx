import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "../../../comun/diseño.ts";
import { getClientes } from "../../../crm/cliente/infraestructura.ts";

interface ClienteProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const Cliente = ({
  descripcion = "",
  valor,
  nombre = "cliente_id",
  label = "Cliente",
  onChange,
  ...props
}: ClienteProps) => {
  const obtenerOpciones = async (texto: string) => {
    const criteria = {
      filtro: {
        nombre: {
          LIKE: texto,
        },
      },
      orden: { id: "DESC" },
    };

    const clientes = await getClientes(
      criteria.filtro as unknown as Filtro,
      criteria.orden as Orden
    );

    return clientes.map((cliente) => ({
      valor: cliente.id,
      descripcion: cliente.nombre,
    }));
  };

  return (
    <QAutocompletar
      label={label}
      nombre={nombre}
      onChange={onChange}
      valor={valor}
      obtenerOpciones={obtenerOpciones}
      descripcion={descripcion}
      {...props}
    />
  );
};
