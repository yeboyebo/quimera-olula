import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { Criteria } from "../../../comun/diseño.ts";
import { obtenerArticulosAlmacen } from "../../articulo/infraestructura.ts";

interface ArticuloProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const Articulo = ({
  descripcion = "",
  valor,
  nombre = "referencia",
  label = "Artículo",
  onChange,
  ...props
}: ArticuloProps) => {
  const obtenerOpciones = async (texto: string) => {
    const criteria: Criteria = {
      filtros: [["descripcion", "~", texto]],
      orden: ["id"],
      paginacion: { limite: 10, pagina: 1 },
    };

    const articulos = await obtenerArticulosAlmacen(
      criteria.filtros,
      criteria.orden
    );

    return articulos.map((articulo) => ({
      valor: articulo.id,
      descripcion: articulo.descripcion,
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
