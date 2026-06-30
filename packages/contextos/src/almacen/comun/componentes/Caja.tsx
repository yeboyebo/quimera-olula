import { QSelect } from "@olula/componentes/index.js";
import { QAutocompletarProps } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "@olula/lib/diseño.ts";
import { useEffect, useState } from "react";
import { getCajas } from "../../caja/infraestructura.ts";

type CajaProps = Omit<QAutocompletarProps, "obtenerOpciones" | "label"> & { label?: string };

type OpcionCaja = {
  valor: string;
  descripcion: string;
};

export const Caja = ({
  valor,
  nombre = "cajaId",
  label = "Caja",
  onChange,
  ...props
}: CajaProps) => {
  const [opciones, setOpciones] = useState<OpcionCaja[]>([]);

  useEffect(() => {
    getCajas(undefined as unknown as Filtro, undefined as unknown as Orden).then(
      ({ datos }) =>
        setOpciones(datos.map((c) => ({ valor: c.id, descripcion: c.id })))
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
