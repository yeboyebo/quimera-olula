import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { getProveedores } from "../../../compras/proveedor/infraestructura.ts";
import { Filtro } from "../../../comun/diseño.ts";

interface ProveedorProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const Proveedor = ({
  descripcion = "",
  valor,
  nombre = "proveedor_id",
  label = "Proveedor",
  onChange,
  ...props
}: ProveedorProps) => {
  const obtenerOpciones = async (texto: string) => {
    const criteria = {
      filtro: ["nombre", "~", texto],
      orden: ["id"],
    };

    const proveedores = await getProveedores(
      criteria.filtro as unknown as Filtro,
      criteria.orden
    );

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
      obtenerOpciones={obtenerOpciones}
      descripcion={descripcion}
      {...props}
    />
  );
};
