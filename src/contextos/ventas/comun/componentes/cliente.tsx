import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "../../../comun/diseño.ts";
import { getClientes } from "../../cliente/infraestructura.ts";

interface ClienteProps {
  descripcion?: string;
  cliente_id: string;
  onClienteChanged: (
    opcion: { valor: string; descripcion: string } | null
  ) => void;
}

export const Clientes = ({
  descripcion = "",
  cliente_id,
  onClienteChanged,
}: ClienteProps) => {
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
      nombre="cliente_id"
      onChange={onClienteChanged}
      valor={cliente_id}
      obtenerOpciones={obtenerOpcionesCliente}
      descripcion={descripcion}
    />
  );
};
