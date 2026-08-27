import { getProveedores } from "#/compras/proveedor/infraestructura.ts";
import { QAutocompletar } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Criteria } from "@olula/lib/diseño.ts";

interface ProveedorProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  deshabilitado?: boolean;
  opcional?: boolean;
  onChange?: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const Proveedor = ({
  descripcion = "",
  valor,
  nombre = "proveedor_id",
  label = "Proveedor",
  deshabilitado = false,
  onChange,
  ...props
}: ProveedorProps) => {
  const obtenerOpciones = async (texto: string, id?: string) => {
    if (!id && texto.length < 2) return [];

    const criteria: Criteria = {
      filtro: id ? [["id", "=", id]] : [["nombre", "~", texto]],
      orden: ["id"],
      paginacion: { pagina: 1, limite: 10 },
    };

    const { datos: proveedores } = await getProveedores(criteria);

    return proveedores.map((proveedor) => ({
      valor: proveedor.id,
      descripcion: proveedor.nombre,
    }));
  };

  return (
    <QAutocompletar
      label={label}
      nombre={nombre}
      onChange={onChange}
      valor={valor}
      autoSeleccion
      obtenerOpciones={obtenerOpciones}
      descripcion={descripcion}
      deshabilitado={deshabilitado}
      {...props}
    />
  );
};
