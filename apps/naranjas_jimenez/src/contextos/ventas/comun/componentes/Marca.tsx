import {
  QAutocompletar,
  QAutocompletarProps,
} from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Criteria } from "@olula/lib/diseño.ts";
import { getItemsListaMarca } from "../../marca/infraestructura.ts";

type MarcaProps = Omit<QAutocompletarProps, "obtenerOpciones">;

export const Marca = ({
  descripcion = "",
  valor,
  nombre = "marca",
  label = "Marca",
  onChange,
  ...props
}: MarcaProps) => {
  const obtenerOpciones = async (texto: string) => {
    const criteria: Criteria = {
      filtro: [["descripcion", "~", texto]],
      orden: ["id"],
      paginacion: { limite: 10, pagina: 1 },
    };

    const marcaes = await getItemsListaMarca(criteria.filtro, criteria.orden);

    return marcaes.map((marca) => ({
      valor: marca.id,
      descripcion: marca.descripcion,
    }));
  };

  return (
    <QAutocompletar
      label={label}
      nombre={nombre}
      onChange={onChange}
      valor={valor}
      descripcion={descripcion}
      obtenerOpciones={obtenerOpciones}
      {...props}
    />
  );
};
