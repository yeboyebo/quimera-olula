import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { Filtro } from "../../../comun/diseño.ts";
import { getClientes } from "../../cliente/infraestructura.ts";

interface ClienteProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  deshabilitado?: boolean;
  onChange?: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const Cliente = ({
  descripcion = "",
  valor,
  nombre = "cliente_id",
  label = "Cliente",
  deshabilitado = false,
  onChange,
  ...props
}: ClienteProps) => {
  const obtenerOpciones = async (texto: string) => {
    const criteria = {
      filtro: ["nombre", "~", texto],
      orden: ["id"],
    };

    const { datos } = await getClientes(
      criteria.filtro as unknown as Filtro,
      criteria.orden
    );

    if (!Array.isArray(datos)) {
      console.error("Los clientes no son un array:", datos);
      return [];
    }

    return datos.map((cliente) => ({
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
      deshabilitado={deshabilitado}
      {...props}
    />
  );
};
