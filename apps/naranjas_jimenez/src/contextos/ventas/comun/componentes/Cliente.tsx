import { QAutocompletar } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Filtro } from "@olula/lib/diseño.ts";
import { getClientes } from "#/ventas/cliente/infraestructura.ts";

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
    const { datos } = await getClientes(
      ["nombre", "~", texto] as unknown as Filtro,
      ["id"],
      { pagina: 1, limite: 10 }
    );
    if (!Array.isArray(datos)) return [];
    return datos.map((cliente) => ({ valor: cliente.id, descripcion: cliente.nombre }));
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
