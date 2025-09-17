import { useEffect, useState } from "react";
import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { Filtro, Orden } from "../../../comun/diseño.ts";
import { getEstadosOportunidadVenta } from "../../oportunidadventa/infraestructura.ts";

interface EstadoOportunidadProps {
  valor: string;
  nombre?: string;
  label?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const EstadoOportunidad = ({
  valor,
  nombre = "estado_id",
  label = "Estado",
  onChange,
  ...props
}: EstadoOportunidadProps) => {
  const [opcionesEstado, setOpcionesEstado] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  useEffect(() => {
    const cargarOpcionesEstado = async () => {
      const criteria = {
        filtro: [] as unknown as Filtro,
        orden: ["id"] as unknown as Orden,
      };

      const estados = await getEstadosOportunidadVenta(
        criteria.filtro,
        criteria.orden
      );

      const opcionesMapeadas = estados.map((estado) => ({
        valor: String(estado.id),
        descripcion: estado.descripcion ?? "",
      }));

      setOpcionesEstado(opcionesMapeadas);
    };

    cargarOpcionesEstado();
  }, []);

  return (
    <QSelect
      label={label}
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opcionesEstado}
      {...props}
    />
  );
};
