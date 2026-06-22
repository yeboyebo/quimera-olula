import { QSelect } from "@olula/componentes/index.js";
import { QAutocompletarProps } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "@olula/lib/diseño.ts";
import { useEffect, useState } from "react";
import { obtenerUbicaciones } from "../../ubicacion/infraestructura.ts";

type UbicacionProps = Omit<QAutocompletarProps, "obtenerOpciones" | "label"> & { label?: string };

type OpcionUbicacion = {
  valor: string;
  descripcion: string;
};

export const Ubicacion = ({
  valor,
  nombre = "ubicacion",
  label = "Ubicación",
  onChange,
  ...props
}: UbicacionProps) => {
  const [opciones, setOpciones] = useState<OpcionUbicacion[]>([]);

  useEffect(() => {
    obtenerUbicaciones(undefined as unknown as Filtro, undefined as unknown as Orden).then(
      (ubicaciones) =>
        setOpciones(ubicaciones.map((u) => ({ valor: u.id, descripcion: u.id })))
    );
  }, []);

  return (
    <QSelect
      label={label}
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opciones}
      {...props}
    />
  );
};
