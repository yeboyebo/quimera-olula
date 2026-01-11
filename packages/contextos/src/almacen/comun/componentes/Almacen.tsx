import { QAutocompletar } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Criteria } from "@olula/lib/diseño.ts";
import { obtenerAlmacenes } from "../../almacen/infraestructura.ts";

interface AlmacenProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const Almacen = ({
  descripcion = "",
  valor,
  nombre = "codalmacen",
  label = "Almacén",
  onChange,
  ...props
}: AlmacenProps) => {
  const obtenerOpciones = async (texto: string) => {
    const criteria: Criteria = {
      filtro: [["nombre", "~", texto]],
      orden: ["id"],
      paginacion: { limite: 10, pagina: 1 },
    };

    const almacenes = await obtenerAlmacenes(criteria.filtro, criteria.orden);

    return almacenes.map((almacen) => ({
      valor: almacen.id,
      descripcion: almacen.nombre,
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
