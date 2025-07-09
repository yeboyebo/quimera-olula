import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "../../../comun/diseño.ts";
import { OportunidadVenta as OportunidadVentaTipo } from "../../oportunidadventa/diseño.ts";
import { getOportunidadesVenta } from "../../oportunidadventa/infraestructura.ts";

interface OportunidadVentaProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  deshabilitado?: boolean;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const OportunidadVenta = ({
  descripcion = "",
  valor,
  nombre = "oportunidad_id",
  label = "Oportunidad",
  deshabilitado = false,
  onChange,
}: OportunidadVentaProps) => {
  const obtenerOpciones = async (input: string) => {
    const criteria = {
      filtro: input ? [["descripcion", "~", input]] : [],
      orden: ["id"],
    };

    const oportunidades = await getOportunidadesVenta(
      criteria.filtro as unknown as Filtro,
      criteria.orden as Orden
    );
    return oportunidades.map((oportunidad: OportunidadVentaTipo) => ({
      valor: oportunidad.id,
      descripcion: oportunidad.descripcion ?? "",
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
    />
  );
};
