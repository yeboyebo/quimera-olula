import {
  QAutocompletar,
  QAutocompletarProps,
} from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Criteria } from "@olula/lib/diseño.ts";
import { getItemsListaCalibre } from "../../calibre/infraestructura.ts";

type CalibreProps = Omit<QAutocompletarProps, "obtenerOpciones">;

export const Calibre = ({
  descripcion = "",
  valor,
  nombre = "calibre",
  label = "Calibre",
  onChange,
  ...props
}: CalibreProps) => {
  const obtenerOpciones = async (texto: string) => {
    const criteria: Criteria = {
      filtro: [["descripcion", "~", texto]],
      orden: ["id"],
      paginacion: { limite: 10, pagina: 1 },
    };

    const calibres = await getItemsListaCalibre(
      criteria.filtro,
      criteria.orden
    );

    return calibres.map((calibre) => ({
      valor: calibre.id,
      descripcion: calibre.descripcion,
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
