import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "../../../comun/diseño.ts";
import { getEstadosOportunidadVenta } from "../../oportunidadventa/infraestructura.ts";

interface EstadoOportunidadProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const EstadoOportunidad = ({
  descripcion = "",
  valor,
  nombre = "estado_id",
  label = "Estado",
  onChange,
}: EstadoOportunidadProps) => {
  const obtenerOpciones = async (input: string) => {
    const criteria = {
      filtro: input
        ? {
            descripcion: {
              LIKE: input,
            },
          }
        : {},
      orden: ["id", "DESC"],
    };

    const estados = await getEstadosOportunidadVenta(
      criteria.filtro as unknown as Filtro,
      criteria.orden as Orden
    );
    return estados.map((estado) => ({
      valor: estado.id,
      descripcion: estado.descripcion ?? "",
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
    />
  );
};
