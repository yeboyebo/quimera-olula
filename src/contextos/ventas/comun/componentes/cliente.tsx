import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "../../../comun/diseño.ts";
import { getClientes } from "../../cliente/infraestructura.ts";

interface ClienteProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  onClienteChanged: (
    opcion: { valor: string; descripcion: string } | null
  ) => void;
}

export const Cliente = ({
  descripcion = "",
  valor,
  nombre = "cliente_id",
  onClienteChanged,
}: ClienteProps) => {
  const obtenerOpcionesCliente = async (texto: string) => {
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
      label="Cliente"
      nombre={nombre}
      onChange={onClienteChanged}
      valor={valor}
      obtenerOpciones={obtenerOpcionesCliente}
      descripcion={descripcion}
    />
  );
};
